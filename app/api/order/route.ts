import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {

    const cart = await prisma.cart.findUnique({
      where: {
        userId: 1
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
      return NextResponse.json({
        error: "Cart is empty"
      });
    }

    let total = 0;

    cart.cartItems.forEach((item) => {
      total +=
        item.foodItem.price * item.quantity;
    });

    const order = await prisma.order.create({
      data: {
        userId: 1,
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