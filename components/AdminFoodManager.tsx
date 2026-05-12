"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Trash2, ToggleLeft, ToggleRight, ArrowLeft, AlertCircle } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";

type FoodItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
};

type AdminFoodManagerProps = {
  initialFoods: FoodItem[];
};

export default function AdminFoodManager({ initialFoods }: AdminFoodManagerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [loading, setLoading] = useState(false);
  const [deletingFoodId, setDeletingFoodId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showForm, setShowForm] = useState(false);

  async function fetchFoods() {
    const res = await fetch("/api/food?includeUnavailable=1");
    const data = await res.json();
    setFoods(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Unable to add food item");
        setMessageType("error");
      } else {
        setMessage("✓ Food item added successfully");
        setMessageType("success");
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Pizza");
        setShowForm(false);
        await fetchFoods();
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleAvailability(id: number, available: boolean) {
    const res = await fetch("/api/food", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        available: !available,
      }),
    });

    if (!res.ok) {
      setMessage("Unable to update availability");
      setMessageType("error");
      return;
    }

    setFoods((prev) =>
      prev.map((food) => (food.id === id ? { ...food, available: !available } : food))
    );

    setMessage("✓ Availability updated");
    setMessageType("success");
  }

  async function removeFood(id: number) {
    if (!confirm("Are you sure you want to delete this food item?")) return;

    setDeletingFoodId(id);

    const res = await fetch("/api/food", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Unable to remove food item");
      setMessageType("error");
      setDeletingFoodId(null);
      return;
    }

    setFoods((prev) => prev.filter((food) => food.id !== id));
    setMessage("✓ Food item deleted");
    setMessageType("success");
    setDeletingFoodId(null);
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
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4 w-fit">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold">
            <span className="text-white">Menu</span>
            <br />
            <span className="gradient-text">Management</span>
          </h1>
          <p className="text-gray-400 text-lg mt-2">Add, edit, and manage food items</p>
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
            {messageType === "error" && <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm">{message}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Food Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card-glass border border-white/20 rounded-3xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Add New Item</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Margherita Pizza"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the food..."
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="299"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-orange-500 focus:bg-white/20 smooth-transition"
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Burgers">Burgers</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Sandwiches">Sandwiches</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Adding..." : "Add Item"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white smooth-transition"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Foods List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={showForm ? "lg:col-span-2" : "lg:col-span-3"}
          >
            {/* Add Button */}
            {!showForm && (
              <motion.button
                variants={itemVariants}
                onClick={() => setShowForm(true)}
                className="mb-6 btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Food Item
              </motion.button>
            )}

            {/* Foods Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {foods.length > 0 ? (
                foods.map((food) => (
                  <motion.div
                    key={food.id}
                    variants={itemVariants}
                    className="card-hover bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{food.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{food.description}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          food.available ? "badge-success" : "badge-error"
                        }`}
                      >
                        {food.available ? "Available" : "Out of Stock"}
                      </div>
                    </div>

                    <div className="mb-4 p-4 rounded-lg bg-linear-to-br from-white/10 to-white/5 text-center text-4xl">
                      🍽️
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-2xl font-bold gradient-text">₹{food.price}</span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => toggleAvailability(food.id, food.available)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white smooth-transition"
                      >
                        {food.available ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            Make Unavailable
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            Make Available
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => removeFood(food.id)}
                        disabled={deletingFoodId === food.id}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-500/10 text-red-400 smooth-transition disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                        {deletingFoodId === food.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No food items yet. Add your first item!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
