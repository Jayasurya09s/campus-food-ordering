"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Download, Printer, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderData {
  orderId: number;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number; unitPrice: number }>;
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
    const dateTime = order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A";
    const itemsText = order?.items
      .map((item) => `${item.name.padEnd(30)} x${item.quantity.toString().padStart(2)} = ₹${item.price.toString().padStart(6)}`)
      .join("\n");

    const content = `
╔════════════════════════════════════════════════════════╗
║            CAMPUS FOOD ORDER RECEIPT                   ║
╚════════════════════════════════════════════════════════╝

CUSTOMER DETAILS:
─────────────────────────────────────────────────────────
Name:                    ${order?.customerName || "N/A"}
Email:                   ${order?.customerEmail || "N/A"}

ORDER DETAILS:
─────────────────────────────────────────────────────────
Order ID:                #${order?.orderId || "N/A"}
Payment ID:              ${order?.paymentId || "N/A"}
Date & Time:             ${dateTime}
Status:                  Paid ✓

ITEMS ORDERED:
─────────────────────────────────────────────────────────
${itemsText}

PAYMENT SUMMARY:
─────────────────────────────────────────────────────────
Total Amount:            ₹${order?.totalAmount || 0}

═══════════════════════════════════════════════════════════
Thank you for your order! 
Your food is being prepared.

═══════════════════════════════════════════════════════════
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
          {/* Customer Details */}
          <div className="mb-8 pb-8 border-b border-white/10 print:border-black">
            <h2 className="text-lg font-semibold text-white mb-4 print:text-black">Customer Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Customer Name</p>
                <p className="text-white print:text-black font-medium">{order?.customerName || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Email</p>
                <p className="text-white print:text-black font-medium">{order?.customerEmail || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6 mb-8 pb-8 border-b border-white/10 print:border-black">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Order Number</p>
                <p className="text-2xl font-bold text-white print:text-black font-mono">#{order?.orderId}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1 print:text-gray-600">Payment ID</p>
                <p className="text-lg text-white print:text-black font-mono">{order?.paymentId}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
          </div>

          {/* Items List */}
          <div className="mb-8 pb-8 border-b border-white/10 print:border-black">
            <h2 className="text-lg font-semibold text-white mb-4 print:text-black">Order Items</h2>
            <div className="space-y-3">
              {order?.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-start p-3 bg-white/5 print:bg-gray-100 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white print:text-black font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm print:text-gray-600">
                      ₹{item.unitPrice} × {item.quantity} = ₹{item.price}
                    </p>
                  </div>
                  <p className="text-white print:text-black font-semibold ml-4">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-linear-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 print:bg-gray-100 print:border-black">
            <span className="text-lg font-semibold text-white print:text-black">Total Amount</span>
            <span className="text-3xl font-bold gradient-text print:text-black print:text-2xl">
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
          <h3 className="font-semibold text-white mb-4">What&apos;s Next?</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span>Your order is being prepared</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span>You&apos;ll receive a notification when it&apos;s ready</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
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