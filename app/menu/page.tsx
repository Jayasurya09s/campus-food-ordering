"use client";

import { useEffect, useState } from "react";

export default function MenuPage() {
  const [foods, setFoods] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/food")
      .then((res) => res.json())
      .then((data) => setFoods(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Food Menu
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {foods.map((food: any) => (
          <div
            key={food.id}
            className="border p-4 rounded-lg"
          >
            <img
              src={food.imageUrl}
              alt={food.name}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="text-xl font-semibold mt-3">
              {food.name}
            </h2>

            <p>{food.description}</p>

            <p className="font-bold mt-2">
              ₹{food.price}
            </p>

            <button
              onClick={async () => {
                await fetch("/api/cart", {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json"
                  },
                  body: JSON.stringify({
                    foodItemId: food.id
                  })
                });

                alert("Added to cart");
              }}
              className="bg-black text-white px-4 py-2 rounded mt-4"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}