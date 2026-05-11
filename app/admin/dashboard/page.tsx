import DashboardChart from "@/components/DashboardChart";
import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/menu");
  }

  const [totalUsers, totalOrders, totalFoodItems, payments, orders, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.foodItem.count(),
    prisma.payment.findMany({
      where: {
        status: "Paid",
      },
    }),
    prisma.order.findMany({
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        orderItems: {
          include: {
            foodItem: true,
          },
        },
      },
    }),
  ]);

  const totalRevenue = payments.reduce((accumulator, payment) => accumulator + payment.amount, 0);

  const chartData = orders.map((order) => ({
    date: order.createdAt.toISOString().split("T")[0],
    amount: order.totalAmount,
  }));

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: "💰",
      trend: "+12% from last month",
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: "📦",
      trend: "+8% from last month",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Users",
      value: totalUsers.toString(),
      icon: "👥",
      trend: "+15% from last month",
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Food Items",
      value: totalFoodItems.toString(),
      icon: "🍽️",
      trend: `+${totalFoodItems % 5 || 3} new items`,
      color: "from-green-500 to-green-600",
    },
  ];

  return <DashboardClient stats={stats} chartData={chartData} recentOrders={recentOrders} />;
}
