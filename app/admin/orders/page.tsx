import { redirect } from "next/navigation";

import AdminOrdersManager from "@/components/AdminOrdersManager";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/menu");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const initialOrders = orders.map((order) => ({
    id: order.id,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt.toISOString(),
    user: {
      name: order.user.name,
      email: order.user.email
    }
  }));

  return <AdminOrdersManager initialOrders={initialOrders} />;
}