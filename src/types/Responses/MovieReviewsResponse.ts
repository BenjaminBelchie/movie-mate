import { type MovieReview } from "../MovieReview";

export type MovieReviewsResponse = {
  data: {
    id: number;
    page: number;
    results: MovieReview[];
    toal_pages: number;
    total_results: number;
  };
};
