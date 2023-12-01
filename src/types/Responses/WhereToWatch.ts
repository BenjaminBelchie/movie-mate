import { type WatchProvider } from "../WatchProvider";

type MovieData = {
  link: string;
  flatrate?: WatchProvider[];
  buy?: WatchProvider[];
  rent?: WatchProvider[];
};

type MovieInfo = Record<string, MovieData>;

export type MovieResults = {
  data: {
    id: number;
    results: MovieInfo;
  };
};
