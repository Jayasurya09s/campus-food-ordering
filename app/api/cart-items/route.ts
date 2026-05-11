import { prisma } from "@/lib/prisma";

import { NextResponse }
from "next/server";

import { getAppSession }
from "@/lib/auth";

export async function GET() {

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

  return NextResponse.json(cart);
}