import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Image,
  Tooltip,
  Avatar,
  Card,
  CardHeader,
  Link,
} from "@nextui-org/react";
import StarIcon from "~/app/_components/Icons/Star";
import AddToFriendsWatchlist from "~/app/_components/add-to-friends-watchlist";
import AddToWatchlist from "~/app/_components/add-to-watchlist";
import MovieDetailTabs from "~/app/_components/movie-detail-tabs";
import { PopoverCard } from "~/app/_components/popover-card";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import {
  buildBackdropImageURL,
  buildLogoURL,
  buildPosterImageURL,
} from "~/util/buildImageURLs";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import fetchMovieByID from "~/util/queries/fetchMovieByID";
import fetchMovieCredits from "~/util/queries/fetchMovieCredits";
import fetchMovieReviews from "~/util/queries/fetchMovieReviews";
import fetchMovieWatchProviders from "~/util/queries/fetchMovieWatchProviders";
import fetchSimularMovies from "~/util/queries/fetchSimularMovies";

export default async function Page({ params }: { params: { id: string } }) {
  const movie = await fetchMovieByID(params.id);
  const session = await getServerAuthSession();
  const coverImage = buildBackdropImageURL("w1280", movie.backdrop_path);

  const simularMovies = await fetchSimularMovies(params.id);
  const movieReviews = await fetchMovieReviews(params.id);
  const movieCredits = await fetchMovieCredits(params.id);
  const whereToWatch = await fetchMovieWatchProviders(params.id);

  let watchlist;
  let friends;
  let isMovieInWatchlist = false;
  if (session) {
    friends = await api.friend.findUserFriends.query();
    watchlist = await getOrCreateUserWatchlist(db, session.user.id);
    const movieInWatchlist = await db.filmOnWatchlist.findFirst({
      where: { AND: [{ filmId: movie.id }, { watchlistId: watchlist.id }] },
    });
    isMovieInWatchlist = !!movieInWatchlist;
  }

  return (
    <>
      <div
        className="flex h-3/5 w-full items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-center gap-8 p-6 md:flex-row md:p-0">
          <div className="hidden md:block">
            <Image
              src={buildPosterImageURL("w342", movie?.poster_path)}
              width={250}
              height={750}
              alt={""}
            />
          </div>
          <div className="flex flex-col gap-4 md:w-3/5">
            <div>
              <p className="mb-2 line-clamp-2 text-4xl font-bold md:line-clamp-none md:text-6xl">
                {movie.title}
              </p>
              <p className="text-large font-semibold md:text-2xl">
                {movie.tagline}
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <p className="text-l font-medium">{movie.release_date}</p>
                <div className="text-l flex items-center font-medium">
                  {movie.vote_average.toFixed()} <StarIcon />
                </div>
                <div className="block md:hidden">
                  <Chip>{movie.runtime} minutes</Chip>
                </div>
              </div>
              <div className="flex">
                {movie.genres.map((genre, key) => (
                  <div className="flex w-fit text-white" key={key}>
                    <p className="line-clamp-1 md:line-clamp-none">
                      {genre.name}
                    </p>
                    {key !== movie.genres.length - 1 && (
                      <p className="px-2">•</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <Chip>{movie.runtime} minutes</Chip>
              </div>
            </div>
            {whereToWatch?.flatrate && (
              <div className="flex flex-col gap-2">
                <p className="text-large">Stream on</p>
                <div className="flex gap-2">
                  {whereToWatch.flatrate.map((provider, index) => (
                    <Image
                      src={buildLogoURL("w45", provider.logo_path)}
                      key={index}
                      width={45}
                      height={45}
                      alt={""}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className=" text-2xl font-semibold ">Overview</p>
              <p className="text-l line-clamp-2 font-medium md:line-clamp-none">
                {movie.overview}
              </p>
            </div>
            <div className="flex gap-2">
              {watchlist ? (
                <>
                  {isMovieInWatchlist ? (
                    <Button disabled>Added to Watchlist</Button>
                  ) : (
                    <AddToWatchlist
                      movie={{
                        adult: movie.adult,
                        backdrop_path: movie.backdrop_path,
                        id: movie.id,
                        genre_ids: movie.genres.map((genre) => genre.id),
                        original_language: movie.original_language,
                        original_title: movie.original_title,
                        overview: movie.overview,
                        popularity: movie.popularity,
                        poster_path: movie.poster_path,
                        release_date: movie.release_date,
                        title: movie.title,
                        video: movie.video,
                        vote_average: movie.vote_average,
                        vote_count: movie.vote_count,
                      }}
                      watchlistId={watchlist?.id}
                      movieWatchProviders={whereToWatch?.flatrate}
                    />
                  )}
                </>
              ) : (
                <Tooltip
                  showArrow={true}
                  placement="bottom"
                  classNames={{ content: "p-2" }}
                  content="You need to signin to add a movie to your watchlist"
                >
                  <Button disabled>Add to Watchlist</Button>
                </Tooltip>
              )}
              <Popover showArrow placement="bottom">
                <PopoverTrigger>
                  <Button color="secondary">Share</Button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  {session ? (
                    <>
                      {friends && friends.length > 0 ? (
                        friends.map(async (friend, index) => {
                          const friendWatchlist =
                            await getOrCreateUserWatchlist(db, friend.friendId);

                          const movieInWatchFriendlist =
                            await db.filmOnWatchlist.findFirst({
                              where: {
                                AND: [
                                  { filmId: movie.id },
                                  { watchlistId: friendWatchlist.id },
                                ],
                              },
                            });

                          const isInFriendWatchlist = !!movieInWatchFriendlist;
                          return (
                            <Card
                              key={index}
                              shadow="none"
                              className="w-[390px] border-none bg-transparent"
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
                                  <Button disabled>In watchlist</Button>
                                ) : (
                                  <AddToFriendsWatchlist
                                    movie={{
                                      adult: movie.adult,
                                      backdrop_path: movie.backdrop_path,
                                      id: movie.id,
                                      genre_ids: movie.genres.map(
                                        (genre) => genre.id,
                                      ),
                                      original_language:
                                        movie.original_language,
                                      original_title: movie.original_title,
                                      overview: movie.overview,
                                      popularity: movie.popularity,
                                      poster_path: movie.poster_path,
                                      release_date: movie.release_date,
                                      title: movie.title,
                                      video: movie.video,
                                      vote_average: movie.vote_average,
                                      vote_count: movie.vote_count,
                                    }}
                                    watchlistId={friendWatchlist.id}
                                    movieWatchProviders={whereToWatch?.flatrate}
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
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center">
        <MovieDetailTabs
          simularMovies={simularMovies.results}
          reviews={movieReviews.results}
          cast={movieCredits.cast}
        />
      </div>
    </>
  );
}
