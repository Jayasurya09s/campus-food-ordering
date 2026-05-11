import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";
import { NextResponse } from "next/server";

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