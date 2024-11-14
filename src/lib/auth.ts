import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { authFormSchema } from "./validations";
import { redirect } from "next/dist/server/api-utils";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        // validate credentials
        const validatedFormData = authFormSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }
        //extract validated data
        const { email, password } = validatedFormData.data;
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          console.log("no user found");
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on middleware request
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      if (isTryingToAccessApp && !isLoggedIn) {
        return false;
      }
      if (isTryingToAccessApp && isLoggedIn && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }
      if (isTryingToAccessApp && isLoggedIn && auth?.user.hasAccess) {
        return true;
      }

      if (
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        isLoggedIn &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (!isTryingToAccessApp && isLoggedIn && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }
        return true;
      }
      if (!isTryingToAccessApp && !isLoggedIn) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on login
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on session update
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        // on session creation
        session.user.id = token.userId;
        session.user.hasAccess = token.hasAccess;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
