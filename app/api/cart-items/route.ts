import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

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

  return NextResponse.json(cart);
}