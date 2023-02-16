import { env } from "../../../env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: input.id }, include: { rounds: true } });
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
});
