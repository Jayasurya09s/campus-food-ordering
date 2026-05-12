import { prisma } from "@/lib/prisma";
import MenuClient from "@/components/MenuClient";

export default async function MenuPage() {
  const foods = await prisma.foodItem.findMany({
    where: {
      available: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const initialFoods = foods.map((food) => ({
    id: food.id,
    name: food.name,
    description: food.description,
    price: food.price,
    category: null,
    available: food.available,
    imageUrl: food.imageUrl,
  }));

  return <MenuClient initialFoods={initialFoods} />;
}
