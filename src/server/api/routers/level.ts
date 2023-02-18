import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const levelRouter = createTRPCRouter({
  getLevel: protectedProcedure.input(z.object({ levelid: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.round.findUnique({ where: { id: input.levelid } });
  }),
});
