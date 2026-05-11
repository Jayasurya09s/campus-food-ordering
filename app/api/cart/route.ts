import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY:", body);

    const cart = await prisma.cart.findFirst({
      where: {
        userId: 1
      }
    });

    console.log("CART:", cart);

    if (!cart) {
      return NextResponse.json({
        error: "Cart not found"
      });
    }

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          foodItemId: body.foodItemId
        }
      });

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + 1
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          foodItemId: body.foodItemId,
          quantity: 1
        }
      });
    }

    return NextResponse.json({
      message: "Added to cart"
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Something went wrong"
    });
  }
}