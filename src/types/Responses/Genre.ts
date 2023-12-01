import { type Genre } from "../Genre";

export type GenreResponse = {
  data: {
    genres: Genre[];
  };
};
