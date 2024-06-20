import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/app/modules/db";
import { PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as unknown as PrismaClient),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser) {
          return null;
        }
        if (credentials?.password != existingUser?.pwd) {
          return null;
        }
        return {
          
          id: existingUser.id + "",
          email: existingUser.email,
          password: existingUser.pwd,
          userimage: existingUser.image,
          username: existingUser.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          userimage: user.userimage,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          userimage: token.userimage,
        },
      };
    },
  },
};
