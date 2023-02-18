import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const levelRouter = createTRPCRouter({
  getAllLevels: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.level.findMany({ orderBy: { rounds: { _count: "desc" } } });
  }),

  getLevel: protectedProcedure.input(z.object({ levelid: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.level.findUnique({ where: { id: input.levelid } });
  }),
});
