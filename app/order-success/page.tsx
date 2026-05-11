"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Download, Printer, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderData {
  orderId: string;
  paymentId: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest order details
    const fetchOrder = async () => {
      try {
        const res = await fetch("/api/order");
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
Campus Food Order Receipt
==========================
Order ID: ${order?.orderId}
Payment ID: ${order?.paymentId}
Date: ${order?.createdAt}
Total: ₹${order?.totalAmount}

Items:
${order?.items.map((item) => `- ${item.name} x${item.quantity} = ₹${item.price}`).join("\n")}

Thank you for your order!
    `.trim();

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `order-${order?.orderId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin w-12 h-12 rounded-full border-4 border-white/20 border-t-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block"
          >
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-300">Your order has been placed successfully</p>
        </div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-glass border border-white/20 rounded-3xl p-8 mb-8 print:border-black print:bg-white print:text-black"
        >
          {/* Order Details */}
          <div className="space-y-6 mb-8 pb-8 border-b border-white/10 print:border-black">
            <div>
              <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Order Number</p>
              <p className="text-2xl font-bold text-white print:text-black font-mono">{order?.orderId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Payment ID</p>
              <p className="text-lg text-white print:text-black font-mono">{order?.paymentId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Order Date & Time</p>
              <p className="text-white print:text-black">
                {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Payment Status</p>
              <span className="badge badge-success">✓ Paid</span>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-8 pb-8 border-b border-white/10 print:border-black">
            <h2 className="text-lg font-semibold text-white mb-4 print:text-black">Order Items</h2>
            <div className="space-y-3">
              {order?.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="text-white print:text-black font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm print:text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white print:text-black font-semibold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-white/5 print:bg-gray-100">
            <span className="text-lg font-semibold text-white print:text-black">Total Amount</span>
            <span className="text-3xl font-bold gradient-text print:text-black">
              ₹{order?.totalAmount}
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mb-8 print:hidden"
        >
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white/10 border border-white/20 hover:border-orange-500/50 text-white smooth-transition"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white/10 border border-white/20 hover:border-orange-500/50 text-white smooth-transition"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>

          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 p-4 rounded-lg btn-primary"
          >
            View Orders
          </Link>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-glass border border-white/20 rounded-2xl p-6 mb-8 print:hidden"
        >
          <h3 className="font-semibold text-white mb-4">What's Next?</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span>Your order is being prepared</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span>You'll receive a notification when it's ready</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <span>Pick up your order and enjoy!</span>
            </li>
          </ol>
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center print:hidden"
        >
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}