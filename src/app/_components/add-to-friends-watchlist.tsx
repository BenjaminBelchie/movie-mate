"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type MovieBrief } from "~/types/MovieBrief";
import { type WatchProvider } from "~/types/WatchProvider";

export default function AddToFriendsWatchlist({
  movie,
  watchlistId,
  movieWatchProviders,
}: {
  movie: MovieBrief;
  watchlistId: string;
  movieWatchProviders?: WatchProvider[];
}) {
  const router = useRouter();
  const addToWatchlistMutation = api.watchlist.addToWatchlist.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const addToWatchlist = (
    movie: MovieBrief,
    watchlistId: string,
    movieWatchProviders: WatchProvider[] | undefined,
  ) => {
    addToWatchlistMutation.mutate({
      movie,
      watchlistId,
      movieProviders: movieWatchProviders,
    });
  };

  return (
    <>
      <Button
        color="primary"
        className="hidden md:block"
        onClick={() => {
          addToWatchlist(movie, watchlistId, movieWatchProviders);
        }}
      >
        Add to Watchlist
      </Button>
      <Button
        color="primary"
        size="sm"
        className="block md:hidden"
        onClick={() => {
          addToWatchlist(movie, watchlistId, movieWatchProviders);
        }}
      >
        Add to Watchlist
      </Button>
    </>
  );
}
