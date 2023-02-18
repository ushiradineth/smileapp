import { levelRouter } from "./routers/level";
import { roundRouter } from "./routers/round";
import { userRouter } from "./routers/user";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  userRouter: userRouter,
  roundRouter: roundRouter,
  levelRouter: levelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
