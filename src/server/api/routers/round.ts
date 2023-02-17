import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const roundRouter = createTRPCRouter({
  setRound: protectedProcedure.input(z.object({ userid: z.string(), question: z.string().url(), solution: z.number(), time: z.number(), success: z.boolean() })).mutation(async ({ input, ctx }) => {
    let level = await ctx.prisma.level.findUnique({ where: { id: input.question } });

    if (!level) {
      level = await ctx.prisma.level.create({
        data: {
          id: input.question.split("/")[6]?.split(".png")[0] || input.question,
          link: input.question,
          solution: input.solution,
        },
      });
    }

    input.success ? await ctx.prisma.user.update({ where: { id: input.userid }, data: { wins: { increment: 1 } } }) : await ctx.prisma.user.update({ where: { id: input.userid }, data: { losses: { increment: 1 } } });

    return await ctx.prisma.round.create({
      data: {
        user: { connect: { id: input.userid } },
        level: { connect: { id: level.id } },
        success: input.success,
        timeTaken: input.time,
      },
    });
  }),
});
