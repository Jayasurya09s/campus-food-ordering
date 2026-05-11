import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: body.email
        }
      });

    if (existingUser) {

      return NextResponse.json({
        error: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword
      }
    });

    await prisma.cart.create({
      data: {
        userId: user.id
      }
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error: "Something went wrong"
    });
  }
}