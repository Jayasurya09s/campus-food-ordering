import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";

const allowedStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "out for delivery",
  "delivered"
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

export async function PATCH(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (typeof body.orderId !== "number" || typeof body.status !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const statusLower = body.status.toLowerCase() as AllowedStatus;

    if (!allowedStatuses.includes(statusLower)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: {
        id: body.orderId
      },
      data: {
        status: statusLower
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
