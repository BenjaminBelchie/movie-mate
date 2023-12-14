"use client";
import { useState } from "react";
import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";
import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AddToWatchlist from "./add-to-watchlist";
import { type MovieBrief } from "~/types/MovieBrief";
import { WatchProvider } from "~/types/WatchProvider";

export const PopoverCard = ({
  friends,
  movie,
  watchlistId,
  movieWatchProviders,
}: {
  friends?: Prisma.FriendGetPayload<{ include: { friend: true } }>[];
  movie: MovieBrief;
  watchlistId: string;
  movieWatchProviders: WatchProvider[];
}) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          {friends && friends.length > 0 ? (
            friends.map((friend, index) => (
              <Card
                key={index}
                shadow="none"
                className="w-[350px] border-none bg-transparent"
              >
                <CardHeader className="justify-between">
                  <div className="flex gap-3">
                    <Avatar
                      isBordered
                      radius="full"
                      size="md"
                      src={
                        friend.friend.image
                          ? friend.friend.image
                          : "/no-image.jpg"
                      }
                    />
                    <div className="flex flex-col items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {friend.friend.name}
                      </h4>
                      <h5 className="text-small tracking-tight text-default-500">
                        {friend.friend.email}
                      </h5>
                    </div>
                  </div>
                  <AddToWatchlist
                    movie={movie}
                    watchlistId={watchlistId}
                    movieWatchProviders={movieWatchProviders}
                  />
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center p-4">
              <p>You have no friends.</p>
              <p>
                Go to{" "}
                <Link href="/friends" className="text-blue-500">
                  friends
                </Link>{" "}
                to find some.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="p-4">You need to signin to share</div>
      )}
    </div>
  );
};
