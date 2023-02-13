import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: input.id }, include: { wins: true, losses: true } });
  }),

  deleteUser: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.delete({ where: { id: input.id } });
  }),

  updateUser: protectedProcedure.input(z.object({ id: z.string(), name: z.string(), image: z.string().url() })).mutation(({ input, ctx }) => {
    return ctx.prisma.user.update({ where: { id: input.id }, data: { name: input.name, image: input.image } });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
