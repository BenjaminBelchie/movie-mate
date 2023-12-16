import { type Prisma } from "@prisma/client";
import { type MovieBrief } from "~/types/MovieBrief";

export const convertWatchlistItemToMovieBrief = (
  watchlistItem: Prisma.FilmOnWatchlistGetPayload<{
    include: {
      film: { include: { watchProviders: { include: { provider: true } } } };
    };
  }>,
): MovieBrief => {
  return {
    adult: watchlistItem.film.adult,
    backdrop_path: watchlistItem.film.backdrop_path,
    id: watchlistItem.film.id,
    genre_ids: [],
    original_language: "",
    original_title: "",
    overview: watchlistItem.film.overview,
    popularity: watchlistItem.film.popularity,
    poster_path: watchlistItem.film.poster_path,
    release_date: watchlistItem.film.release_date,
    title: watchlistItem.film.title,
    video: false,
    vote_average: watchlistItem.film.vote_average,
    vote_count: 0,
  };
};
