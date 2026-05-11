"use client";

import { useEffect, useState } from "react";

export default function CartPage() {

  const [cart, setCart] = useState<any>(null);

  async function fetchCart() {
    const res = await fetch("/api/cart-items");
    const data = await res.json();

    setCart(data);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function placeOrder() {

    await fetch("/api/order", {
      method: "POST"
    });

    alert("Order placed");

    fetchCart();
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        My Cart
      </h1>

      {!cart ||
      cart.cartItems.length === 0 ? (

        <p>Cart is empty</p>

      ) : (

        <>
          <div className="space-y-4">

            {cart.cartItems.map(
              (item: any) => (

                <div
                  key={item.id}
                  className="border p-4 rounded"
                >
                  <h2 className="text-xl font-semibold">
                    {item.foodItem.name}
                  </h2>

                  <p>
                    Quantity:
                    {" "}
                    {item.quantity}
                  </p>

                  <p>
                    ₹
                    {item.foodItem.price}
                  </p>
                </div>
              )
            )}
          </div>

          <button
            onClick={placeOrder}
            className="bg-black text-white px-6 py-3 rounded mt-6"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}