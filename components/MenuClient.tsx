"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Star, ShoppingCart, CheckCircle2, AlertCircle } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";

type FoodItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
  imageUrl?: string | null;
  rating?: number;
};

type MenuClientProps = {
  initialFoods: FoodItem[];
};

export default function MenuClient({ initialFoods }: MenuClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  const filteredFoods = useMemo(() => {
    const filtered = initialFoods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [searchQuery, sortBy, initialFoods]);

  const addToCart = async (foodId: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodItemId: foodId }),
      });

      if (res.ok) {
        setNotification({ type: "success", text: "Added to cart" });
      } else if (res.status === 401) {
        window.location.assign("/login");
      } else {
        const data = await res.json();
        setNotification({ type: "error", text: data.error || "Unable to add to cart" });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification({ type: "error", text: "Error adding to cart" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-24 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-500/15 border-green-500/30 text-green-300"
                : "bg-red-500/15 border-red-500/30 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{notification.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">Browse</span>
            <br />
            <span className="gradient-text">Our Menu</span>
          </h1>
          <p className="text-gray-400 text-lg">Discover delicious food items</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="     Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:bg-white/20 smooth-transition"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </motion.div>
        </motion.div>

        {/* category filters removed per request */}

        {filteredFoods.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredFoods.map((food) => (
              <motion.div
                key={food.id}
                variants={itemVariants}
                className="group card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                    />
                  ) : (
                    <div className="text-6xl group-hover:scale-110 smooth-transition">🍽️</div>
                  )}
                  {!food.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="badge badge-error">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-white mb-1 truncate">{food.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 truncate-2 flex-1">
                    {food.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold gradient-text">₹{food.price}</span>
                      {food.rating && (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span className="text-sm">{food.rating}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(food.id)}
                      disabled={!food.available}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No foods found matching your criteria</p>
          </div>
        )}

        <Link
          href="/cart"
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl shadow-2xl shadow-orange-500/50 hover:scale-110 smooth-transition md:hidden"
        >
          🛒
        </Link>
      </div>
    </div>
  );
}
