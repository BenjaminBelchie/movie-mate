import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
} from "@nextui-org/react";
import { type WatchProvider, type Prisma } from "@prisma/client";
import ShareMovieCard from "./share-movie-card";
import { type MovieBrief } from "~/types/MovieBrief";

export default function SharePopover({
  friends,
  movie,
  watchProviders,
  smallShareBtn = false,
}: {
  friends?: Prisma.FriendGetPayload<{ include: { friend: true } }>[];
  movie: MovieBrief;
  watchProviders?: WatchProvider[];
  smallShareBtn?: boolean;
}) {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <Button color="secondary" size={smallShareBtn ? "sm" : "md"}>
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <ShareMovieCard
          friends={friends}
          movie={movie}
          movieWatchProviders={watchProviders}
        />
      </PopoverContent>
    </Popover>
  );
}
