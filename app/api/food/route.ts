import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const foods = await prisma.foodItem.findMany();

  return NextResponse.json(foods);
}

export async function POST(req: Request) {
  const body = await req.json();

  const food = await prisma.foodItem.create({
    data: {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      imageUrl: body.imageUrl
    }
  });

  return NextResponse.json(food);
}