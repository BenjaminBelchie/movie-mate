import axios from "axios";
import { env } from "process";
import { type MovieWatchProviderResponse } from "~/types/Responses/MovieWatchProviderResponse";

export default async function fetchMovieWatchProviders(movieID: string) {
  const movieWatchProviders: MovieWatchProviderResponse = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieID}/watch/providers`,
    {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    },
  );

  for (const region in movieWatchProviders.data.results) {
    if (region === "GB") {
      console.log(movieWatchProviders.data.results[region]);
      return movieWatchProviders.data.results[region];
    }
  }
  return undefined;
}
