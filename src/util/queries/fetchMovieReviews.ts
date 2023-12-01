import axios from "axios";
import { env } from "process";
import { type MovieReviewsResponse } from "~/types/Responses/MovieReviewsResponse";

export default async function fetchMovieReviews(movieID: string) {
  const simularMoviesResponse: MovieReviewsResponse = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieID}/reviews`,
    {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    },
  );
  return simularMoviesResponse.data;
}
