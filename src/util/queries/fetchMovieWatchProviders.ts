import axios from "axios";
import { env } from "process";
import { type MovieResults } from "~/types/Responses/WhereToWatch";

export default async function fetchMovieWatchProviders(movieID: string) {
  const simularMoviesResponse: MovieResults = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieID}/watch/providers`,
    {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    },
  );

  for (const region in simularMoviesResponse.data.results) {
    if (region === "GB") {
      return simularMoviesResponse.data.results[region];
    }
  }
  return null;
}
