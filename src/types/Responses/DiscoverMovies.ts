import { type MovieBrief } from "../MovieBrief";

export type DiscoverMoviesResponse = {
  data: {
    page: number;
    results: MovieBrief[];
    total_pages: number;
    total_results: number;
  };
};
