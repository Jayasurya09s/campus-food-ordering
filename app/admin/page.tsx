import { redirect } from "next/navigation";

import AdminFoodManager from "@/components/AdminFoodManager";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/menu");
  }

  const foods = await prisma.foodItem.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  const initialFoods = foods.map((food) => ({
    id: food.id,
    name: food.name,
    description: food.description,
    price: food.price,
    imageUrl: food.imageUrl,
    available: food.available
  }));

  return <AdminFoodManager initialFoods={initialFoods} />;
}