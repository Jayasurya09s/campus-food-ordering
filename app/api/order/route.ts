import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getAppSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the latest order for the user with payment and order items
    const order = await prisma.order.findFirst({
      where: {
        userId: Number(session.user.id)
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            foodItem: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        },
        payment: {
          select: {
            razorpayPaymentId: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        orderId: order.id,
        paymentId: order.payment?.razorpayPaymentId || "N/A",
        customerName: order.user.name,
        customerEmail: order.user.email,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.orderItems.map((item) => ({
          name: item.foodItem.name,
          quantity: item.quantity,
          price: item.subtotal,
          unitPrice: item.foodItem.price
        }))
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getAppSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: Number(session.user.id)
      },
      include: {
        cartItems: {
          include: {
            foodItem: true
          }
        }
      }
    });

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json(
        {
          error: "Cart is empty"
        },
        { status: 400 }
      );
    }

    let total = 0;

    cart.cartItems.forEach((item) => {
      total +=
        item.foodItem.price * item.quantity;
    });

    const order = await prisma.order.create({
      data: {
        userId: Number(session.user.id),
        totalAmount: total,
        status: "Pending"
      }
    });

    for (const item of cart.cartItems) {

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          subtotal:
            item.foodItem.price *
            item.quantity
        }
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id
      }
    });

    return NextResponse.json({
      message: "Order placed"
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error: "Something went wrong"
    });
  }
}