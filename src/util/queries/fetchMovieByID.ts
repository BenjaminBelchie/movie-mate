import axios from "axios";
import { notFound } from "next/navigation";
import { env } from "process";
import { type MovieDetailsResponse } from "~/types/Responses/MovieDetails";

export default async function fetchMovieByID(id: string) {
  const movieResponse: MovieDetailsResponse = await axios
    .get(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${env.TMDB_READ_ACCESS_TOKEN}` },
    })
    .catch(() => {
      notFound();
    });
  return movieResponse.data;
}
