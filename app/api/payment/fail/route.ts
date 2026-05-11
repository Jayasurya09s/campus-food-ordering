import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAppSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAppSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.razorpayOrderId) {
      return NextResponse.json(
        { error: "razorpayOrderId is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        razorpayOrderId: body.razorpayOrderId
      },
      include: {
        order: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.order.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: "Failed"
      }
    });

    await prisma.order.update({
      where: {
        id: payment.orderId
      },
      data: {
        paymentStatus: "Failed"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
