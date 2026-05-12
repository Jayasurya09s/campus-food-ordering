"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";
import DashboardChart from "@/components/DashboardChart";

interface Stat {
  label: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

interface ChartDataPoint {
  date: string;
  amount: number;
}

interface RecentOrder {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  user?: { name?: string; email?: string };
  orderItems?: Array<{ foodItem: { name: string }; quantity: number }>;
}

interface DashboardClientProps {
  stats: Stat[];
  chartData: ChartDataPoint[];
  recentOrders: RecentOrder[];
}

export default function DashboardClient({
  stats,
  chartData,
  recentOrders,
}: DashboardClientProps) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Menu Management",
      href: "/admin",
      icon: "🍽️",
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: "📦",
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: "💳",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">Admin</span>
            <br />
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-lg">Welcome back! Here&apos;s your business overview.</p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          {menuItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-4 rounded-lg card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 group"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm text-gray-400">Go to</p>
                  <p className="font-semibold text-white group-hover:text-orange-400 smooth-transition">
                    {item.label}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 ml-auto group-hover:text-orange-400 smooth-transition" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="group card-hover bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-6 hover:border-orange-500/50 overflow-hidden relative"
            >
              {/* Background Gradient */}
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-10 blur-3xl bg-gradient-to-br ${stat.color}`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{stat.trend}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-glass border border-white/20 rounded-3xl p-8 mb-12"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Revenue Analytics</h2>
            <p className="text-gray-400">Your earnings over time</p>
          </div>

          {chartData.length > 0 ? (
            <div className="bg-white/5 rounded-lg p-6">
              <DashboardChart chartData={chartData} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No order data available yet.</p>
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-glass border border-white/20 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Recent Orders</h2>
              <p className="text-gray-400">Latest orders from your customers</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-2 smooth-transition"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Order ID
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/5 smooth-transition"
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono text-white font-semibold">#{order.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white">{order.user?.name || "Customer"}</div>
                        <div className="text-gray-400 text-sm">{order.user?.email}</div>
                      </td>
                      <td className="px-4 py-4 text-white font-semibold">₹{order.totalAmount}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "delivered"
                              ? "badge-success"
                              : order.status === "preparing"
                                ? "badge-info"
                                : order.status === "confirmed"
                                  ? "badge-info"
                                  : "badge-warning"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No orders yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}