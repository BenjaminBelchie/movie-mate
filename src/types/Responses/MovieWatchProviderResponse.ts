import { type MovieWatchProvider } from "../MovieWatchProvider";

export type MovieWatchProviderResponse = {
  data: {
    id: number;
    results: Record<string, MovieWatchProvider>;
  };
};
