"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Trash2, ToggleLeft, ToggleRight, ArrowLeft, AlertCircle } from "lucide-react";
import { staggerContainer, itemVariants } from "@/lib/animations";
import { useRealtimeFood } from "@/lib/useRealtimeFood";

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
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingFoodId, setDeletingFoodId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showForm, setShowForm] = useState(false);

  // Use real-time hook for automatic menu updates
  const { foods, refreshFoods } = useRealtimeFood(initialFoods, { 
    pollIntervalMs: 2000, // Poll every 2 seconds for fast updates
    includeUnavailable: true // Admins see all items including unavailable
  });

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
          imageUrl,
        }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        setMessage((data && data.error) || "Unable to add food item");
        setMessageType("error");
      } else {
        setMessage("✓ Food item added successfully");
        setMessageType("success");
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setShowForm(false);
        // Real-time hook will automatically sync
        refreshFoods();
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleAvailability(id: number, available: boolean) {
    try {
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage((data && data.error) || "Unable to update availability");
        setMessageType("error");
        return;
      }

      setMessage("✓ Availability updated");
      setMessageType("success");
      // Real-time hook will automatically sync
      refreshFoods();
    } catch (err) {
      setMessage("Unable to update availability");
      setMessageType("error");
    }
  }

  async function removeFood(id: number) {
    setDeletingFoodId(id);

    try {
      const res = await fetch("/api/food", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage((data && data.error) || "Unable to remove food item");
        setMessageType("error");
        setDeletingFoodId(null);
        return;
      }

      setMessage("✓ Food item deleted");
      setMessageType("success");
      setDeletingFoodId(null);
      // Real-time hook will automatically sync
      refreshFoods();
    } catch (err) {
      setMessage("Unable to remove food item");
      setMessageType("error");
      setDeletingFoodId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      {pendingDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white">Delete food item?</h3>
            <p className="text-gray-400 mt-2 text-sm">
              This will remove the item from menu and related cart/order line items.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white smooth-transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = pendingDeleteId;
                  setPendingDeleteId(null);
                  if (id !== null) await removeFood(id);
                }}
                className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white smooth-transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
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
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-orange-500 focus:bg-white/20 smooth-transition"
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

                    <div className="mb-4 p-4 rounded-lg bg-linear-to-br from-white/10 to-white/5 text-center overflow-hidden">
                      {food.imageUrl ? (
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="h-40 w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-4xl py-12">🍽️</div>
                      )}
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
                        onClick={() => setPendingDeleteId(food.id)}
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
