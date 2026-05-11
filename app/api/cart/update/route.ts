import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";

import { NextResponse }
from "next/server";

export async function POST(
  req: Request
) {

  try {
    const session =
      await getAppSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body =
      await req.json();

    const cartItem =
      await prisma.cartItem.findUnique({
        where: {
          id: body.cartItemId
        },
        include: {
          cart: true
        }
      });

    if (!cartItem) {

      return NextResponse.json(
        {
          error: "Cart item not found"
        },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const newQuantity =
      cartItem.quantity + body.change;

    if (newQuantity <= 0) {

      await prisma.cartItem.delete({
        where: {
          id: cartItem.id
        }
      });

    } else {

      await prisma.cartItem.update({
        where: {
          id: cartItem.id
        },

        data: {
          quantity: newQuantity
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