"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, ArrowLeft, CreditCard } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";

interface Payment {
  id: number;
  amount: number;
  status: string;
    razorpayPaymentId: string | null;
    razorpayOrderId: string | null;
  createdAt: string;
  order: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
}

interface AdminPaymentsClientProps {
  initialPayments: Payment[];
}

export default function AdminPaymentsClient({ initialPayments }: AdminPaymentsClientProps) {
  const totalRevenue = initialPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = initialPayments.filter((p) => p.status === "Paid").length;

  const handleExport = () => {
    const csv = [
      ["Payment ID", "Order ID", "Amount", "Status", "Date", "Customer"],
      ...initialPayments.map((p) => [
        p.razorpayPaymentId,
        p.order.id,
        p.amount,
        p.status,
        new Date(p.createdAt).toLocaleDateString(),
        p.order.user.name,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `payments-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold">
            <span className="text-white">Payment</span>
            <br />
            <span className="gradient-text">Management</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">View and track all payments</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              label: "Total Revenue",
              value: `₹${totalRevenue.toLocaleString()}`,
              icon: "💰",
            },
            {
              label: "Successful Payments",
              value: successfulPayments.toString(),
              icon: "✓",
            },
            {
              label: "Total Transactions",
              value: initialPayments.length.toString(),
              icon: "💳",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card-glass border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orange-500/50 smooth-transition"
          >
            <Download className="w-5 h-5" />
            Export to CSV
          </button>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card-glass border border-white/20 rounded-3xl p-6 md:p-8 overflow-x-auto"
        >
          {initialPayments.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Payment ID
                  </th>
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Customer
                  </th>
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Amount
                  </th>
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-gray-400 font-semibold text-sm">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {initialPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-white/5 hover:bg-white/5 smooth-transition"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-orange-400 font-semibold text-sm">
                          {payment.razorpayPaymentId ? payment.razorpayPaymentId.slice(0, 15) : "—"}...
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white font-semibold">#{payment.order.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-white">{payment.order.user.name}</div>
                      <div className="text-gray-500 text-xs">{payment.order.user.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-lg font-bold gradient-text">₹{payment.amount}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "Paid" ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No payments yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}