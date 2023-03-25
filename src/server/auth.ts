import type { GetServerSidePropsContext } from "next";
import { type DefaultSession, type NextAuthOptions, getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../env.mjs";
import { prisma } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    session({ session, token }) {
      if (token.user) {
        const t = token.user as {
          id: string;
          handle: string;
        };

        session.user = {
          id: t.id,
          email: token.email,
          image: token.picture,
          name: token.name,
        };
      }
      return Promise.resolve(session);
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({ where: { email: credentials.email } });

        if (!user) return null;

        const result = await bcrypt.compare(credentials.password, user.password || "");

        if (result) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } else return null;
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
