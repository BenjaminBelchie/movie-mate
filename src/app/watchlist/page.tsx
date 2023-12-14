import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Image as UIImage,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { buildLogoURL, buildPosterImageURL } from "~/util/buildImageURLs";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import AddToFriendsWatchlist from "../_components/add-to-friends-watchlist";

export default async function WatchlistPage() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/api/auth/signin");

  const watchlist = await getOrCreateUserWatchlist(db, session.user.id);
  const watchlistItems = await db.filmOnWatchlist.findMany({
    where: { watchlistId: watchlist.id },
    include: {
      film: { include: { watchProviders: { include: { provider: true } } } },
    },
  });

  const friends = await db.friend.findMany({
    where: { userId: session.user.id },
    include: { friend: true },
  });

  return (
    <div className="flex w-full items-center justify-center">
      <div className="my-5 flex flex-col gap-4 md:w-[1400px]">
        <div className="flex w-full justify-between">
          <p className="text-4xl font-bold">Watchlist</p>
          <div className="flex flex-row items-center gap-2">
            <Link href="/">
              <Button color="primary">Find Movies</Button>
            </Link>
          </div>
        </div>
        {watchlistItems && watchlistItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {watchlistItems.map((watchlistItem, index) => (
              <Card key={index}>
                <div className="flex justify-between p-4">
                  <div className="flex items-center gap-5">
                    <Image
                      width={92}
                      height={138}
                      className="h-[138px]"
                      alt={watchlistItem.film.title}
                      src={buildPosterImageURL(
                        "w92",
                        watchlistItem.film.poster_path,
                      )}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <h4 className="line-clamp-1 text-2xl font-semibold leading-none text-default-600">
                            <Link href={`/movie/${watchlistItem.film.id}`}>
                              {watchlistItem.film.title}
                            </Link>
                          </h4>
                          <h5 className="text-small tracking-tight text-default-400">
                            {watchlistItem.film.release_date}
                          </h5>
                        </div>
                        <div className="flex gap-2">
                          {watchlistItem?.film.watchProviders.map(
                            (provider, index) => (
                              <UIImage
                                src={buildLogoURL(
                                  "w45",
                                  provider.provider.logo_path,
                                )}
                                key={index}
                                width={40}
                                height={40}
                                alt={""}
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <Divider />
                      <p className="my-2 line-clamp-2">
                        {watchlistItem.film.overview}
                      </p>
                      <div className="flex gap-2">
                        <Popover showArrow placement="bottom">
                          <PopoverTrigger>
                            <Button color="secondary" size="sm">
                              Share
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-1">
                            {session ? (
                              <>
                                {friends && friends.length > 0 ? (
                                  friends.map(async (friend, index) => {
                                    const friendWatchlist =
                                      await getOrCreateUserWatchlist(
                                        db,
                                        friend.friendId,
                                      );
                                    return (
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
                                          <AddToFriendsWatchlist
                                            movie={{
                                              adult: watchlistItem.film.adult,
                                              backdrop_path:
                                                watchlistItem.film
                                                  .backdrop_path,
                                              id: watchlistItem.film.id,
                                              genre_ids: [],
                                              original_language: "",
                                              original_title: "",
                                              overview:
                                                watchlistItem.film.overview,
                                              popularity:
                                                watchlistItem.film.popularity,
                                              poster_path:
                                                watchlistItem.film.poster_path,
                                              release_date:
                                                watchlistItem.film.release_date,
                                              title: watchlistItem.film.title,
                                              video: false,
                                              vote_average:
                                                watchlistItem.film.vote_average,
                                              vote_count: 0,
                                            }}
                                            watchlistId={friendWatchlist.id}
                                            movieWatchProviders={watchlistItem.film.watchProviders.map(
                                              (watchlistProvider) => {
                                                return {
                                                  provider_id:
                                                    watchlistProvider.provider
                                                      .provider_id,
                                                  logo_path:
                                                    watchlistProvider.provider
                                                      .logo_path,
                                                  provider_name:
                                                    watchlistProvider.provider
                                                      .provider_name,
                                                };
                                              },
                                            )}
                                          />
                                        </CardHeader>
                                      </Card>
                                    );
                                  })
                                ) : (
                                  <div className="flex flex-col items-center p-4">
                                    <p>You have no friends.</p>
                                    <p>
                                      Go to{" "}
                                      <Link
                                        href="/friends"
                                        className="text-blue-500"
                                      >
                                        friends
                                      </Link>{" "}
                                      to find some.
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="p-4">
                                You need to signin to share
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        <Button size="sm">Remove from Watchlist</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/Error-page.png"
              height={500}
              width={500}
              alt="Not-found"
            />
            <p className="text-2xl font-semibold">No Watchlist Items</p>
          </div>
        )}
      </div>
    </div>
  );
}
