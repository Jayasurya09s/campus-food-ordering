import { prisma } from "@/lib/prisma";

import { NextResponse }
from "next/server";

import { getAppSession }
from "@/lib/auth";

export async function POST(
  req: Request
) {

  try {

    const session =
      await getAppSession();

    if (!session?.user) {

      return NextResponse.json({
        error: "Unauthorized"
      });
    }

    const body =
      await req.json();

    const foodItem =
      await prisma.foodItem.findUnique({
        where: {
          id: body.foodItemId
        }
      });

    if (!foodItem || !foodItem.available) {
      return NextResponse.json(
        { error: "Food item is unavailable" },
        { status: 400 }
      );
    }

    const cart =
      await prisma.cart.findUnique({
        where: {
          userId: Number(
            session.user.id
          )
        }
      });

    if (!cart) {

      return NextResponse.json({
        error: "Cart not found"
      });
    }

    const existingItem =
      await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          foodItemId:
            foodItem.id
        }
      });

    if (existingItem) {

      await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },

        data: {
          quantity:
            existingItem.quantity + 1
        }
      });

    } else {

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          foodItemId:
            foodItem.id,
          quantity: 1
        }
      });
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error: "Something went wrong"
    });
  }
}