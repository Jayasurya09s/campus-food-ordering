import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {

  const orders = await prisma.order.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        All Orders
      </h1>

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border p-4 rounded"
          >
            <h2 className="text-xl font-semibold">
              Order #{order.id}
            </h2>

            <p>
              Customer:
              {" "}
              {order.user.name}
            </p>

            <p>
              Amount:
              {" "}
              ₹{order.totalAmount}
            </p>

            <p>
              Status:
              {" "}
              {order.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}