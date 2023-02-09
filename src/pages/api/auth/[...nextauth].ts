import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { env } from "../../../env.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      session = {
        ...session,
        user: {
          id: user.id,
          handle: user.handle,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      };
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: "smtp.gmail.com",
        port: "587",
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_SERVER_USER,
    }),
  ],
};

export default NextAuth(authOptions);
