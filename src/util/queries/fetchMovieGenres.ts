import axios from "axios";
import { env } from "process";
import { type GenreResponse } from "~/types/Responses/Genre";

export default async function fetchMovieGenres() {
  const movieGenresResponse: GenreResponse = await axios.get(
    "https://api.themoviedb.org/3/genre/movie/list",
    { headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` } },
  );
  return movieGenresResponse.data;
}
