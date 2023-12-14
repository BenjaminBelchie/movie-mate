import { friendRouter } from "~/server/api/routers/friends";
import { createTRPCRouter } from "~/server/api/trpc";
import { watchlistRouter } from "./routers/watchlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  friend: friendRouter,
  watchlist: watchlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
