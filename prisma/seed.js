const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.foodItem.createMany({
    data: [
      {
        name: "Burger",
        description: "Cheesy chicken burger",
        price: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
      },
      {
        name: "Pizza",
        description: "Farmhouse pizza",
        price: 250,
        imageUrl:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591"
      },
      {
        name: "Pasta",
        description: "White sauce pasta",
        price: 180,
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9"
      }
    ]
  });

  console.log("Food items added");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });