import { type TVShowBrief } from "../TVShowBrief";

export type PopularTVShowResponse = {
  data: {
    page: number;
    results: TVShowBrief[];
    total_pages: number;
    total_results: number;
  };
};
