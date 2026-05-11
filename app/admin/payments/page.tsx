import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminPaymentsClient from "@/components/AdminPaymentsClient";

export default async function AdminPaymentsPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/menu");
  }

  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const initialPayments = payments.map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    status: payment.status,
    razorpayPaymentId: payment.razorpayPaymentId,
    razorpayOrderId: payment.razorpayOrderId,
    createdAt: payment.createdAt.toISOString(),
    order: {
      id: payment.order.id,
      user: {
        name: payment.order.user.name,
        email: payment.order.user.email,
      },
    },
  }));

  return <AdminPaymentsClient initialPayments={initialPayments} />;
}