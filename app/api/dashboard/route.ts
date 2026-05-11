import { prisma }
from "@/lib/prisma";
import { getAppSession }
from "@/lib/auth";

import { NextResponse }
from "next/server";

export async function GET() {

  try {
    const session =
      await getAppSession();

    if (!session?.user ||
        session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const totalUsers =
      await prisma.user.count();

    const totalOrders =
      await prisma.order.count();

    const totalFoodItems =
      await prisma.foodItem.count();

    const payments =
      await prisma.payment.findMany({
        where: {
          status: "Paid"
        }
      });

    const totalRevenue =
      payments.reduce(
        (acc, payment) =>
          acc + payment.amount,
        0
      );

    const orders =
      await prisma.order.findMany({
        orderBy: {
          createdAt: "asc"
        }
      });

    const chartData =
      orders.map((order) => ({
        date:
          order.createdAt
            .toISOString()
            .split("T")[0],

        amount:
          order.totalAmount
      }));

    return NextResponse.json({

      totalUsers,

      totalOrders,

      totalFoodItems,

      totalRevenue,

      chartData
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error:
        "Something went wrong"
    });
  }
}