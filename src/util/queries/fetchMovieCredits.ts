import axios from "axios";
import { notFound } from "next/navigation";
import { env } from "process";
import { type MovieCreditsResponse } from "~/types/Responses/MovieCredits";

export default async function fetchMovieCredits(id: string) {
  const movieResponse: MovieCreditsResponse = await axios
    .get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    })
    .catch(() => {
      notFound();
    });
  return movieResponse.data;
}
