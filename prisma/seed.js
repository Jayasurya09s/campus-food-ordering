/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@gmail.com"
    },
    update: {
      name: "Admin",
      role: "admin",
      password: adminPassword
    },
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin"
    }
  });

  await prisma.cart.upsert({
    where: {
      userId: admin.id
    },
    update: {},
    create: {
      userId: admin.id
    }
  });

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