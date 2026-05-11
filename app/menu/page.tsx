"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Star, ShoppingCart, ChevronDown } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";

interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  rating?: number;
}

export default function MenuPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Sandwiches", "Beverages"];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/food");
      const data = await res.json();
      setFoods(data || []);
      setFilteredFoods(data || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = foods.filter(
      (food) =>
        (selectedCategory === "All" || food.category === selectedCategory) &&
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredFoods(filtered);
  }, [searchQuery, selectedCategory, sortBy, foods]);

  const addToCart = async (foodId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId, quantity: 1 }),
      });

      if (res.ok) {
        // Show success feedback
        alert("Added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Search and Filters */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {/* Search Bar */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
              />
            </div>
          </motion.div>

          {/* Sort Dropdown */}
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

        {/* Categories */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={itemVariants}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap smooth-transition ${
                selectedCategory === cat
                  ? "btn-primary"
                  : "bg-white/10 border border-white/20 text-white hover:border-orange-500/50 hover:bg-white/20"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Food Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-white/5 border border-white/10 animate-shimmer"
              />
            ))}
          </div>
        ) : filteredFoods.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredFoods.map((food) => (
              <motion.div
                key={food._id}
                variants={itemVariants}
                className="group card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl group-hover:scale-110 smooth-transition">
                    🍽️
                  </div>
                  {!food.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="badge badge-error">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-white mb-1 truncate">{food.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 truncate-2 flex-1">
                    {food.description}
                  </p>

                  {/* Footer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold gradient-text">
                        ₹{food.price}
                      </span>
                      {food.rating && (
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span className="text-sm">{food.rating}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(food._id)}
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

        {/* Floating Cart Button */}
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