import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {

  const orders = await prisma.order.findMany({
    where: {
      userId: 1
    },
    include: {
      orderItems: {
        include: {
          foodItem: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Order History
      </h1>

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border p-6 rounded-lg"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Order #{order.id}
              </h2>

              <p>
                {order.status}
              </p>
            </div>

            {order.orderItems.map((item) => (

              <div
                key={item.id}
                className="flex justify-between py-2"
              >
                <p>
                  {item.foodItem.name}
                </p>

                <p>
                  x{item.quantity}
                </p>
              </div>
            ))}

            <p className="font-bold mt-4">
              Total:
              {" "}
              ₹{order.totalAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}