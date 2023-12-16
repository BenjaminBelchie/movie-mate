import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
} from "@nextui-org/react";
import { type WatchProvider, type Prisma } from "@prisma/client";
import { ShareIcon } from "../Icons/ShareIcon";
import ShareMovieCard from "./share-movie-card";
import { type MovieBrief } from "~/types/MovieBrief";

export default function MobileSharePopover({
  friends,
  movie,
  watchProviders,
}: {
  friends?: Prisma.FriendGetPayload<{ include: { friend: true } }>[];
  movie: MovieBrief;
  watchProviders?: WatchProvider[];
}) {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <Button color="secondary" isIconOnly size="sm">
          <ShareIcon />
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
