import { type MovieBrief } from "~/types/MovieBrief";
import fetchMovieGenres from "./queries/fetchMovieGenres";

export default async function getMovieGenres(movie: MovieBrief | undefined) {
  const movieGenres = await fetchMovieGenres();
  const genres: string[] = [];
  movieGenres.genres.forEach((element) => {
    movie?.genre_ids.forEach((id) => {
      if (element.id === id) {
        genres.push(element.name);
      }
    });
  });
  return genres;
}
