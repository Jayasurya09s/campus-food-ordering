import { razorpay }
from "@/lib/razorpay";

import { prisma }
from "@/lib/prisma";

import { getAppSession }
from "@/lib/auth";

import { NextResponse }
from "next/server";

export async function POST() {

  try {

    const session =
      await getAppSession();

    if (!session?.user) {

      return NextResponse.json({
        error: "Unauthorized"
      });
    }

    const cart =
      await prisma.cart.findUnique({
        where: {
          userId: Number(
            session.user.id
          )
        },

        include: {
          cartItems: {
            include: {
              foodItem: true
            }
          }
        }
      });

    if (!cart ||
        cart.cartItems.length === 0) {

      return NextResponse.json({
        error: "Cart empty"
      });
    }

    const unavailableItem =
      cart.cartItems.find(
        (item) => !item.foodItem.available
      );

    if (unavailableItem) {
      return NextResponse.json(
        {
          error: `${unavailableItem.foodItem.name} is currently unavailable`
        },
        { status: 400 }
      );
    }

    let subtotal = 0;

    cart.cartItems.forEach((item) => {
      subtotal += item.foodItem.price * item.quantity;
    });

    const tax = Math.round(subtotal * 0.05);
    const delivery = 50;
    const total = subtotal + tax + delivery;

    const order = await prisma.order.create({
      data: {
        userId: Number(session.user.id),
        totalAmount: total,
        paymentStatus: "Pending",
      },
    });

    for (const item of cart.cartItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          foodItemId: item.foodItemId,
          quantity: item.quantity,
          subtotal: item.foodItem.price * item.quantity,
        },
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `order_${order.id}`,
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        status: "Pending",
      },
    });

    return NextResponse.json({
      razorpayOrder,
      key:
        process.env
          .RAZORPAY_KEY_ID
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error:
        "Something went wrong"
    });
  }
}