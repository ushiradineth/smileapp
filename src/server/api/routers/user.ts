import { env } from "../../../env.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: input.id }, include: { rounds: true } });
  }),

  createUser: publicProcedure.input(z.object({ name: z.string(), email: z.string(), password: z.string() })).mutation(async ({ input, ctx }) => {
    const doesUserExist = await ctx.prisma.user.findFirst({ where: { email: input.email } });

    if (doesUserExist) {
      return null;
    } else {
      const salt = await bcrypt.genSalt();
      const hash: string = await bcrypt.hash(input.password, salt);
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hash,
        },
      });
    }
  }),

  deleteUser: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);
    const { error } = await supabase.storage.from(env.NEXT_PUBLIC_SUPABASE_BUCKET).remove([`Users/${input.id}/ProfilePicture`]);

    if (error) return error;
    else
      return ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
  }),

  updateName: protectedProcedure.input(z.object({ id: z.string(), name: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.update({ where: { id: input.id }, data: { name: input.name } });
  }),

  updateImage: protectedProcedure.input(z.object({ id: z.string(), image: z.string().url() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.update({ where: { id: input.id }, data: { image: input.image } });
  }),

  getLeaderboard: protectedProcedure.input(z.object({ page: z.number() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findMany({
      take: 25,
      skip: (input.page - 1) * 25,
      orderBy: {
        wins: "desc",
      },
    });
  }),

  getUserRank: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: {
        wins: "desc",
      },
    });

    return users.findIndex((e) => e.id === input.id) + 1;
  }),
});
