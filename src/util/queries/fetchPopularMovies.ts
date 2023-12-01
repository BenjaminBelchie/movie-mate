import axios from "axios";
import { env } from "~/env";
import { type DiscoverMoviesResponse } from "~/types/Responses/DiscoverMovies";

export default async function fetchPopularMovies() {
  const popularMoviesResponse: DiscoverMoviesResponse = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
    { headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` } },
  );
  return popularMoviesResponse.data;
}
