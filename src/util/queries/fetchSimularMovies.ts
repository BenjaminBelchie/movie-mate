import axios from "axios";
import { env } from "process";
import { type DiscoverMoviesResponse } from "~/types/Responses/DiscoverMovies";

export default async function fetchSimularMovies(movieID: string) {
  const simularMoviesResponse: DiscoverMoviesResponse = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieID}/recommendations`,
    {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    },
  );
  return simularMoviesResponse.data;
}
