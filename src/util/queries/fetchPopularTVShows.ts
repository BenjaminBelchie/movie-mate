import axios from "axios";
import { env } from "~/env";
import { type PopularTVShowResponse } from "~/types/Responses/PopularTVShows";

export default async function fetchPopularShows() {
  const popularTVShows: PopularTVShowResponse = await axios.get(
    "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
    { headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` } },
  );
  return popularTVShows.data;
}
