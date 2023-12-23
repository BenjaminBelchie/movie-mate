import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import fetchMovieWatchProviders from "~/util/queries/fetchMovieWatchProviders";
import SendEmail from "../email";

export const watchlistRouter = createTRPCRouter({
  addToWatchlist: protectedProcedure
    .input(
      z.object({
        watchlistId: z.string().min(1),
        movie: z.object({
          id: z.number(),
          adult: z.boolean(),
          backdrop_path: z.string().nullable(),
          original_language: z.string(),
          overview: z.string(),
          popularity: z.number(),
          poster_path: z.string(),
          release_date: z.string(),
          title: z.string(),
          vote_average: z.number(),
        }),
        movieProviders: z
          .array(
            z.object({
              logo_path: z.string(),
              provider_id: z.number(),
              provider_name: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userWatchlist = await ctx.db.userWatchlist.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (userWatchlist?.id !== input.watchlistId) {
        console.log("Adding to friends watchlist");
        const friend = await ctx.db.userWatchlist.findUnique({
          where: { id: input.watchlistId },
          include: { user: true },
        });
        if (friend && ctx.session.user.email) {
          await SendEmail(
            friend.user.email,
            friend.user.name,
            ctx.session.user.email,
            input.movie.title,
          );
        }
      }
      if (!input.movieProviders) {
        const providers = await fetchMovieWatchProviders(
          input.movie.id.toString(),
        );
        input.movieProviders = providers?.flatrate;
      }
      const film = await ctx.db.film.findUnique({
        where: { id: input.movie.id },
      });

      if (film) {
        return ctx.db.filmOnWatchlist.create({
          data: {
            filmId: input.movie.id,
            watchlistId: input.watchlistId,
            addedById: ctx.session.user.id,
          },
        });
      } else {
        return ctx.db.film.create({
          data: {
            watchlistId: input.watchlistId,
            ...input.movie,
            watchlist: {
              connectOrCreate: {
                where: { id: input.watchlistId },
                create: {
                  watchlistId: input.watchlistId,
                  addedById: ctx.session.user.id,
                },
              },
            },
            watchProviders: {
              create: input.movieProviders?.map((provider) => ({
                provider: {
                  connectOrCreate: {
                    where: { provider_id: provider.provider_id },
                    create: {
                      logo_path: provider.logo_path,
                      provider_id: provider.provider_id,
                      provider_name: provider.provider_name,
                    },
                  },
                },
              })),
            },
          },
        });
      }
    }),
  removeFromWatchlist: protectedProcedure
    .input(
      z.object({
        watchlistItemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.filmOnWatchlist.delete({
        where: { id: input.watchlistItemId },
      });
    }),

  getUserWatchlist: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      await getOrCreateUserWatchlist(ctx.db, input.userId);
      return ctx.db.userWatchlist.findFirst({
        where: { userId: input.userId },
      });
    }),

  getFilmOnWatchlist: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userWatchlist = await ctx.db.userWatchlist.findFirst({
        where: { userId: ctx.session.user.id },
      });
      return ctx.db.filmOnWatchlist.findFirst({
        where: {
          AND: [{ watchlistId: userWatchlist?.id }, { filmId: input.movieId }],
        },
      });
    }),

  getFilmOnFriendWatchlist: protectedProcedure
    .input(z.object({ movieId: z.number(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userWatchlist = await ctx.db.userWatchlist.findFirst({
        where: { userId: input.userId },
      });
      const watchlistItem = await ctx.db.filmOnWatchlist.findFirst({
        where: {
          AND: [{ watchlistId: userWatchlist?.id }, { filmId: input.movieId }],
        },
      });
      return !!watchlistItem;
    }),
});
