"use client";
import { Button, Tooltip } from "@nextui-org/react";
import { HeartIcon } from "../Icons/HeartIcon";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type MovieBrief } from "~/types/MovieBrief";
import { type WatchProvider } from "@prisma/client";

export default function AddToWatchlistIconButton({
  movie,
  watchlistId,
  watchlistItemId,
  movieProviders,
  isInWatchlist,
}: {
  movie: MovieBrief;
  watchlistId: string;
  watchlistItemId: string | undefined;
  movieProviders: WatchProvider[] | undefined;
  isInWatchlist: boolean;
}) {
  const router = useRouter();
  const addToWatchlistMutation = api.watchlist.addToWatchlist.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const removeFromWatchlistMutation =
    api.watchlist.removeFromWatchlist.useMutation({
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

  const removeFromWatchlist = (watchlistItemId: string) => {
    removeFromWatchlistMutation.mutate({ watchlistItemId });
  };
  return (
    <Tooltip
      content={isInWatchlist ? "Remove from Watchlist" : "Add to watchlist"}
      placement="bottom"
      classNames={{ content: "p-2" }}
    >
      <Button
        isIconOnly
        variant="flat"
        onClick={() => {
          isInWatchlist && watchlistItemId
            ? removeFromWatchlist(watchlistItemId)
            : addToWatchlist(movie, watchlistId, movieProviders);
        }}
      >
        <HeartIcon
          fill={isInWatchlist ? "#f34545" : "transparent"}
          strokeWidth={isInWatchlist ? 0 : 1}
        />
      </Button>
    </Tooltip>
  );
}
