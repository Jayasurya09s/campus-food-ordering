"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, AlertCircle } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";
import RouteAutoRefresh from "@/components/RouteAutoRefresh";

type FoodItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
};

type CartItem = {
  id: number;
  quantity: number;
  foodItem: FoodItem;
};

type CartData = {
  cartItems: CartItem[];
};

type RazorpayCheckoutResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayCheckoutResponse) => Promise<void>;
  prefill: { name: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  var Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

type CartClientProps = {
  initialCart: CartData | null;
};

export default function CartClient({ initialCart }: CartClientProps) {
  const [cart, setCart] = useState<CartData | null>(initialCart);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchCart() {
    const res = await fetch("/api/cart-items");
    const data: {
      error?: string;
      cartItems?: CartItem[];
    } = await res.json();

    if (data.error || !data.cartItems) {
      setCart(null);
      return;
    }

    setCart({
      cartItems: data.cartItems,
    });
  }

  async function updateQuantity(cartItemId: number, change: number) {
    setUpdatingId(cartItemId);
    setErrorMessage("");

    try {
      const res = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, change }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to update cart");
        return;
      }

      await fetchCart();
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(cartItemId: number) {
    await updateQuantity(cartItemId, -Infinity);
  }

  async function handlePayment() {
    setIsPaying(true);
    setErrorMessage("");

    const res = await fetch("/api/payment", {
      method: "POST",
    });

    const data: {
      error?: string;
      key?: string;
      razorpayOrder?: { id: string; amount: number };
    } = await res.json();

    if (!res.ok || data.error || !data.key || !data.razorpayOrder) {
      setErrorMessage(data.error || "Payment initiation failed");
      setIsPaying(false);
      return;
    }

    const { key, razorpayOrder } = data;

    const options: RazorpayOptions = {
      key,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Meghana Food",
      description: "Food Order",
      order_id: razorpayOrder.id,
      handler: async (response) => {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData: {
          success?: boolean;
          error?: string;
        } = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          window.location.href = "/order-success";
        } else {
          setErrorMessage(verifyData.error || "Payment verification failed");
        }
        setIsPaying(false);
      },
      prefill: { name: "Customer" },
      theme: { color: "#ff9500" },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", async (response: { error?: { description?: string } }) => {
      await fetch("/api/payment/fail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayOrderId: razorpayOrder.id,
          reason: response.error?.description,
        }),
      });

      setErrorMessage(response.error?.description || "Payment failed");
      setIsPaying(false);
    });

    razorpay.open();
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero py-20 px-4">
        <RouteAutoRefresh intervalMs={10000} />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 text-lg mb-8">Add some delicious food to get started!</p>
            <Link href="/menu" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const subtotal = cart.cartItems.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = 50;
  const total = subtotal + tax + delivery;

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <RouteAutoRefresh intervalMs={10000} />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/menu" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Link>
          <h1 className="text-4xl font-bold text-white">
            Shopping Cart <span className="text-gray-400">({cart.cartItems.length})</span>
          </h1>
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {cart.cartItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl p-6 flex gap-6 items-center"
              >
                <div className="w-24 h-24 rounded-xl bg-linear-to-br from-white/10 to-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.foodItem.imageUrl ? (
                    <img
                      src={item.foodItem.imageUrl}
                      alt={item.foodItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🍽️</span>
                  )}
                </div>

                {/* Food Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{item.foodItem.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">Per item: ₹{item.foodItem.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={updatingId === item.id}
                      className="p-2 rounded-lg hover:bg-white/10 smooth-transition disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={updatingId === item.id}
                      className="p-2 rounded-lg hover:bg-white/10 smooth-transition disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Price and Remove */}
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text mb-4">
                    ₹{item.foodItem.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={updatingId === item.id}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 smooth-transition disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="card-glass border border-white/20 rounded-2xl p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span>₹{delivery}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-3xl font-bold gradient-text">₹{total}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPaying ? "Processing..." : "Proceed to Payment"}
              {!isPaying && <ArrowLeft className="w-5 h-5 rotate-180" />}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Payments processed by Razorpay
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
