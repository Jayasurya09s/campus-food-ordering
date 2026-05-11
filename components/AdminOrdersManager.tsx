"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

const statusOptions = ["Pending", "Confirmed", "Preparing", "Delivered"];

const statusColors: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  preparing: "badge-info",
  delivered: "badge-success",
};

type AdminOrdersManagerProps = {
  initialOrders: Order[];
};

export default function AdminOrdersManager({ initialOrders }: AdminOrdersManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  async function updateStatus(orderId: number, status: string) {
    setSavingOrderId(orderId);
    setMessage("");

    const res = await fetch("/api/order/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        status: status.toLowerCase(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Unable to update status");
      setMessageType("error");
      setSavingOrderId(null);
      return;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: status.toLowerCase() } : order))
    );

    setMessage("✓ Order status updated successfully");
    setMessageType("success");
    setSavingOrderId(null);
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold">
            <span className="text-white">Manage</span>
            <br />
            <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">View and update order statuses</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {messageType === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {messageType === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm">{message}</p>
          </motion.div>
        )}

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No orders yet.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {orders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                className="card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl p-6"
              >
                <div className="grid md:grid-cols-5 gap-6 items-center">
                  {/* Order ID */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Order ID</p>
                    <p className="text-white font-mono font-bold text-lg">#{order.id}</p>
                  </div>

                  {/* Customer */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Customer</p>
                    <p className="text-white font-semibold">{order.user.name}</p>
                    <p className="text-gray-500 text-xs">{order.user.email}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-lg font-bold gradient-text">₹{order.totalAmount}</p>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Payment</p>
                    <span className="badge badge-success">
                      ✓ {order.paymentStatus === "Paid" ? "Paid" : order.paymentStatus}
                    </span>
                  </div>

                  {/* Status Update */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Status</p>
                    <select
                      value={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={savingOrderId === order.id}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:bg-white/20 smooth-transition disabled:opacity-50 text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      Order Date: {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <span
                      className={`${
                        statusColors[order.status.toLowerCase()] || "badge-warning"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
