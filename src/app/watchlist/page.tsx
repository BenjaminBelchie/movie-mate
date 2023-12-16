import {
  Avatar,
  Button,
  Card,
  Divider,
  Tooltip,
  Image as UIImage,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { buildLogoURL, buildPosterImageURL } from "~/util/buildImageURLs";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import SharePopover from "../_components/ShareMovie/share-popover";
import MobileSharePopover from "../_components/ShareMovie/mobile-share-popover";
import { convertWatchlistItemToMovieBrief } from "~/util/convertWatchlistItemToMovieBrief";
import { convertWatchlistProvidersToWatchproviders } from "~/util/convertWatchlistProvidersToWatchProviders";
import RemoveFromWatchlist from "../_components/Watchlist/remove-from-watchlist";
import FilterFriendsAutocomplete from "../_components/Watchlist/filter-friends-autocomplete";
import SortItemsBy from "../_components/Watchlist/sort-items-by";

export default async function WatchlistPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const session = await getServerAuthSession();
  if (!session) return redirect("/api/auth/signin");

  console.log(searchParams);

  const watchlist = await getOrCreateUserWatchlist(db, session.user.id);
  const watchlistItems = await db.filmOnWatchlist.findMany({
    where: {
      AND: [
        { watchlistId: watchlist.id },
        searchParams.addedBy ? { addedById: searchParams.addedBy } : {},
      ],
    },
    include: {
      film: { include: { watchProviders: { include: { provider: true } } } },
      addedBy: true,
    },
    orderBy:
      searchParams.sort && searchParams.sort === "oldest"
        ? { dateAdded: "asc" }
        : { dateAdded: "desc" },
  });

  const friends = await db.friend.findMany({
    where: { userId: session.user.id },
    include: { friend: true },
  });

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-4 my-5 flex flex-col gap-4 md:mx-0 md:w-[1400px]">
        <div className="flex w-full justify-between">
          <p className="text-4xl font-bold">Watchlist</p>
          <div className="flex flex-row items-center gap-2">
            <Link href="/">
              <Button color="primary">Find Movies</Button>
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <FilterFriendsAutocomplete
            friends={friends.map((friend) => friend.friend)}
          />
          <SortItemsBy />
        </div>
        {watchlistItems && watchlistItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
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
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="hidden md:block">
                            <SharePopover
                              friends={friends}
                              movie={convertWatchlistItemToMovieBrief(
                                watchlistItem,
                              )}
                              smallShareBtn
                              watchProviders={convertWatchlistProvidersToWatchproviders(
                                watchlistItem,
                              )}
                            />
                          </div>
                          <div className="block md:hidden">
                            <MobileSharePopover
                              friends={friends}
                              movie={convertWatchlistItemToMovieBrief(
                                watchlistItem,
                              )}
                              watchProviders={convertWatchlistProvidersToWatchproviders(
                                watchlistItem,
                              )}
                            />
                          </div>
                          <RemoveFromWatchlist
                            watchlistItemId={watchlistItem.id}
                          />
                        </div>
                        <Tooltip
                          placement="bottom"
                          classNames={{ content: "p-2" }}
                          content={`This film was added by ${watchlistItem.addedBy.name}`}
                        >
                          <Avatar
                            src={
                              watchlistItem.addedBy.image
                                ? watchlistItem.addedBy.image
                                : "/no-image.jpg"
                            }
                          />
                        </Tooltip>
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
