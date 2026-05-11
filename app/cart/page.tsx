import { redirect } from "next/navigation";

import CartClient from "@/components/CartClient";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CartPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: Number(session.user.id)
    },
    select: {
      cartItems: {
        select: {
          id: true,
          quantity: true,
          foodItem: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });

  return <CartClient initialCart={cart} />;
}