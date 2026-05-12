"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, DollarSign, ArrowLeft, Package } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";
import RouteAutoRefresh from "@/components/RouteAutoRefresh";

interface FoodItem {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  foodItem: FoodItem;
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: Date;
  orderItems: OrderItem[];
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
}

interface OrdersClientProps {
  orders: Order[];
}

const statusConfig: Record<string, { color: string; badge: string; icon: string }> = {
  pending: { color: "bg-yellow-100 dark:bg-yellow-900", badge: "badge-warning", icon: "⏳" },
  confirmed: { color: "bg-blue-100 dark:bg-blue-900", badge: "badge-info", icon: "✓" },
  preparing: { color: "bg-purple-100 dark:bg-purple-900", badge: "badge-info", icon: "👨‍🍳" },
  delivered: { color: "bg-green-100 dark:bg-green-900", badge: "badge-success", icon: "✓✓" },
  cancelled: { color: "bg-red-100 dark:bg-red-900", badge: "badge-error", icon: "✕" },
};

export default function OrdersClient({ orders }: OrdersClientProps) {
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero py-20 px-4">
        <RouteAutoRefresh intervalMs={10000} />
        <div className="max-w-6xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-8 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No Orders Yet</h2>
            <p className="text-gray-400 text-lg mb-8">Start by ordering some delicious food!</p>
            <Link href="/menu" className="btn-primary inline-flex items-center gap-2">
              Order Now
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <RouteAutoRefresh intervalMs={10000} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/menu" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Link>
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">Your</span>
            <br />
            <span className="gradient-text">Orders</span>
          </h1>
          <p className="text-gray-400 text-lg">Track your food orders in real-time</p>
        </motion.div>

        {/* Orders Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {orders.map((order) => {
            const config = statusConfig[order.status.toLowerCase()] || statusConfig.pending;
            const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <motion.div
                key={order.id}
                variants={itemVariants}
                className="card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Order ID</p>
                      <h2 className="text-xl font-bold text-white font-mono"># {order.id}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`${config.badge}`}>
                        {config.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                      <p className="text-2xl font-bold gradient-text">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Order Date</p>
                        <p className="text-white font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Items</p>
                        <p className="text-white font-medium">{totalItems} item(s)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Payment ID</p>
                        <p className="text-white font-mono text-sm font-medium truncate">
                          {order.razorpayPaymentId || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                          <div>
                            <p className="text-white font-medium">{item.foodItem.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-orange-400 font-semibold">
                            ₹{item.foodItem.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div>
                    <p className="text-gray-400 text-sm mb-3">Order Status</p>
                    <div className="flex items-center gap-2">
                      {["pending", "confirmed", "preparing", "delivered"].map((step, idx) => (
                        <div key={step} className="flex items-center flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold smooth-transition ${
                              ["pending", "confirmed", "preparing", "delivered"].indexOf(
                                order.status.toLowerCase()
                              ) >= idx
                                ? "bg-orange-500 text-white"
                                : "bg-white/10 text-gray-500"
                            }`}
                          >
                            {["pending", "confirmed", "preparing", "delivered"].indexOf(
                              order.status.toLowerCase()
                            ) > idx ? (
                              <span>✓</span>
                            ) : ["pending", "confirmed", "preparing", "delivered"].indexOf(
                                order.status.toLowerCase()
                              ) === idx ? (
                              <span>→</span>
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          {idx < 3 && (
                            <div
                              className={`flex-1 h-1 mx-1 rounded-full smooth-transition ${
                                ["pending", "confirmed", "preparing", "delivered"].indexOf(
                                  order.status.toLowerCase()
                                ) > idx
                                  ? "bg-orange-500"
                                  : "bg-white/10"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Pending</span>
                      <span>Confirmed</span>
                      <span>Preparing</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}