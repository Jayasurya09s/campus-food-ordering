import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAppSession();
    const { searchParams } = new URL(req.url);
    const includeUnavailable = searchParams.get("includeUnavailable") === "1";

    const isAdmin = session?.user?.role === "admin";

    const foods = await prisma.foodItem.findMany({
      where: includeUnavailable && isAdmin ? {} : { available: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(foods);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const food = await prisma.foodItem.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        imageUrl: body.imageUrl,
        available: true,
      },
    });

    return NextResponse.json(food);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    if (typeof body.id !== "number" || typeof body.available !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const food = await prisma.foodItem.update({
      where: {
        id: body.id,
      },
      data: {
        available: body.available,
      },
    });

    return NextResponse.json(food);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    if (typeof body.id !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({
        where: {
          foodItemId: body.id,
        },
      });

      await tx.orderItem.deleteMany({
        where: {
          foodItemId: body.id,
        },
      });

      await tx.foodItem.delete({
        where: {
          id: body.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}