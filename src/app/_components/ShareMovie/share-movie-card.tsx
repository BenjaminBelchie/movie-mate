import { Avatar, Button, Card, CardHeader, Link } from "@nextui-org/react";
import { type WatchProvider, type Prisma } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import AddToFriendsWatchlist from "../add-to-friends-watchlist";
import { type MovieBrief } from "~/types/MovieBrief";
import fetchMovieWatchProviders from "~/util/queries/fetchMovieWatchProviders";

export default async function ShareMovieCard({
  friends,
  movie,
  movieWatchProviders,
}: {
  friends?: Prisma.FriendGetPayload<{ include: { friend: true } }>[];
  movie: MovieBrief;
  movieWatchProviders?: WatchProvider[];
}) {
  const session = await getServerAuthSession();
  return (
    <>
      {session ? (
        <>
          {friends && friends.length > 0 ? (
            friends.map(async (friend, index) => {
              const friendWatchlist = await getOrCreateUserWatchlist(
                db,
                friend.friendId,
              );

              const movieInWatchFriendlist = await db.filmOnWatchlist.findFirst(
                {
                  where: {
                    AND: [
                      { filmId: movie.id },
                      { watchlistId: friendWatchlist.id },
                    ],
                  },
                },
              );

              let whereToWatch;
              if (!movieWatchProviders) {
                whereToWatch = await fetchMovieWatchProviders(
                  movie.id.toString(),
                );
              }

              const isInFriendWatchlist = !!movieInWatchFriendlist;
              return (
                <Card
                  key={index}
                  shadow="none"
                  className="w-[360px] border-none bg-transparent md:w-[390px]"
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
                    {isInFriendWatchlist ? (
                      <>
                        <Button className="hidden md:block" disabled>
                          In watchlist
                        </Button>
                        <Button className="block md:hidden" size="sm" disabled>
                          In watchlist
                        </Button>
                      </>
                    ) : (
                      <AddToFriendsWatchlist
                        movie={movie}
                        watchlistId={friendWatchlist.id}
                        movieWatchProviders={
                          movieWatchProviders
                            ? movieWatchProviders
                            : whereToWatch?.flatrate
                        }
                      />
                    )}
                  </CardHeader>
                </Card>
              );
            })
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
    </>
  );
}
