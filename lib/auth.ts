import { getServerSession } from "next-auth/next";
import type { Session, User } from "next-auth";

import CredentialsProvider
from "next-auth/providers/credentials";

import bcrypt from "bcrypt";

export const authOptions = {

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {

        if (!credentials?.email ||
            !credentials?.password) {
          return null;
        }

        const { prisma } = await import("@/lib/prisma");

        const user =
          await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

        if (!user) {
          return null;
        }

        const isPasswordCorrect =
          await bcrypt.compare(
            credentials.password,
            user.password
          );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],

  session: {
    strategy: "jwt" as const
  },

  callbacks: {

    async jwt({
      token,
      user
    }: {
      token: {
        id?: string;
        role?: string;
      };
      user?: User;
    }) {

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({
      session,
      token
    }: {
      session: Session;
      token: {
        id?: string;
        role?: string;
      };
    }) {

      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }

        if (token.role) {
          session.user.role = token.role;
        }
      }

      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};

export type AppSession = {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export async function getAppSession() {
  return (await getServerSession(authOptions as never)) as AppSession | null;
}