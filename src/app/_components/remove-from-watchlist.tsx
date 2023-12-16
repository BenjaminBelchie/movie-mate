"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function RemoveFromWatchlist({
  watchlistItemId,
}: {
  watchlistItemId: string;
}) {
  const router = useRouter();
  const removeFromWatchlistMutation =
    api.watchlist.removeFromWatchlist.useMutation({
      onSuccess: () => {
        router.refresh();
      },
    });
  const removeFromWatchlist = () => {
    removeFromWatchlistMutation.mutate({ watchlistItemId });
  };

  return (
    <>
      <Button
        size="sm"
        className="hidden md:block"
        onClick={removeFromWatchlist}
      >
        Remove from Watchlist
      </Button>
      <Button
        size="sm"
        className="flex md:hidden"
        onClick={removeFromWatchlist}
      >
        Remove
      </Button>
    </>
  );
}
