import axios from "axios";
import { env } from "~/env";
import { type DiscoverMoviesResponse } from "~/types/Responses/DiscoverMovies";

export default async function searchForMovies(movie: string, page: number) {
  const popularMoviesResponse: DiscoverMoviesResponse = await axios.get(
    `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=${page}`,
    { headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` } },
  );
  return popularMoviesResponse.data;
}
