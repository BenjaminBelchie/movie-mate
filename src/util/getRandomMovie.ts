import { type MovieBrief } from "~/types/MovieBrief";

export default function getRandomMovie(movies: MovieBrief[]) {
  return movies[Math.floor(Math.random() * movies.length)];
}
