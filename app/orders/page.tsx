import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "@/components/OrdersClient";

export default async function OrdersPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: Number(session.user.id),
    },
    include: {
      orderItems: {
        include: {
          foodItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <OrdersClient orders={orders} />;
}