import crypto from "crypto";

import { prisma }
from "@/lib/prisma";

import { NextResponse }
from "next/server";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = body;

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET!
        )
        .update(
          razorpay_order_id +
          "|" +
          razorpay_payment_id
        )
        .digest("hex");

    const isValid =
      generatedSignature ===
      razorpay_signature;

    if (!isValid) {
      const existingPayment =
        await prisma.payment.findFirst({
          where: {
            razorpayOrderId:
              razorpay_order_id
          }
        });

      if (existingPayment) {
        await prisma.payment.update({
          where: {
            id: existingPayment.id
          },
          data: {
            status: "Failed"
          }
        });

        await prisma.order.update({
          where: {
            id: existingPayment.orderId
          },
          data: {
            paymentStatus: "Failed"
          }
        });
      }

      return NextResponse.json({
        error:
          "Payment verification failed"
      });
    }

    const payment =
      await prisma.payment.findFirst({
        where: {
          razorpayOrderId:
            razorpay_order_id
        }
      });

    if (!payment) {

      return NextResponse.json({
        error:
          "Payment record not found"
      });
    }

    await prisma.payment.update({
      where: {
        id: payment.id
      },

      data: {
        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,

        status: "Paid"
      }
    });

    await prisma.order.update({
      where: {
        id: payment.orderId
      },

      data: {
        paymentStatus: "Paid",
        status: "Confirmed"
      }
    });

    const order =
      await prisma.order.findUnique({
        where: {
          id: payment.orderId
        }
      });

    if (order) {

      const cart =
        await prisma.cart.findUnique({
          where: {
            userId: order.userId
          }
        });

      if (cart) {

        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id
          }
        });
      }
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error:
        "Something went wrong"
    });
  }
}