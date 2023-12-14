import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Nav from "./_components/navbar";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import EmblaCarousel from "~/app/_components/Carousel/embla-carousel";
import { type EmblaOptionsType } from "embla-carousel-react";
import StarIcon from "./_components/Icons/Star";
import Link from "next/link";
import fetchPopularMovies from "~/util/queries/fetchPopularMovies";
import getRandomMovie from "~/util/getRandomMovie";
import { buildBackdropImageURL } from "~/util/buildImageURLs";
import getMovieGenres from "~/util/getMovieGenres";
import AddToFriendsWatchlist from "./_components/add-to-friends-watchlist";
import { db } from "~/server/db";
import { getOrCreateUserWatchlist } from "~/util/getOrCreateUserWatchlist";
import fetchMovieWatchProviders from "~/util/queries/fetchMovieWatchProviders";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  const popularMovies = await fetchPopularMovies();
  const heroMovie = getRandomMovie(popularMovies.results);
  const genres = await getMovieGenres(heroMovie);

  let friends;
  if (session && heroMovie) {
    friends = await api.friend.findUserFriends.query();
  }

  const backdropImage = buildBackdropImageURL(
    "w1280",
    heroMovie?.backdrop_path,
  );

  const OPTIONS: EmblaOptionsType = {
    dragFree: true,
    containScroll: "trimSnaps",
  };

  return (
    <main>
      <div className="h-screen">
        <div
          className="h-3/5 w-full bg-center md:h-4/6 md:bg-left-top "
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(${backdropImage})`,
            backgroundSize: "cover",
          }}
        >
          <Nav isBlurred={false} />
          <div className="z-10 mx-8 flex h-3/5 flex-col justify-end gap-4">
            <p className=" line-clamp-2 text-4xl font-bold text-white md:text-7xl">
              {heroMovie?.title}
            </p>
            <div className="flex flex-col gap-1 md:flex-row md:gap-4">
              <div className="flex gap-4">
                <p className=" font-semibold text-white ">
                  {heroMovie?.release_date}
                </p>
                <div className="flex items-center text-white">
                  {heroMovie?.vote_average.toFixed()}
                  <StarIcon />
                </div>
              </div>
              <div className="flex">
                {genres.map((genre, key) => (
                  <div className="flex w-fit text-white" key={key}>
                    {genre}
                    {key !== genres.length - 1 && <p className="px-2">•</p>}
                  </div>
                ))}
              </div>
            </div>
            <p className="mx-1 line-clamp-2 w-full text-medium font-semibold text-white md:w-1/2 md:text-xl">
              {heroMovie?.overview}
            </p>
            <div className="flex gap-4">
              <Button color="primary" className="w-fit">
                <Link href={`/movie/${heroMovie?.id}`} className="text-white">
                  See Movie
                </Link>
              </Button>
              <Popover showArrow placement="bottom">
                <PopoverTrigger>
                  <Button color="secondary">Share</Button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  {session && heroMovie ? (
                    <>
                      {friends && friends.length > 0 ? (
                        friends.map(async (friend, index) => {
                          const friendWatchlist =
                            await getOrCreateUserWatchlist(db, friend.friendId);

                          const whereToWatch = await fetchMovieWatchProviders(
                            heroMovie.id.toString(),
                          );

                          const movieInWatchFriendlist =
                            await db.filmOnWatchlist.findFirst({
                              where: {
                                AND: [
                                  { filmId: heroMovie?.id },
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
                                {!isInFriendWatchlist && heroMovie ? (
                                  <AddToFriendsWatchlist
                                    movie={{
                                      adult: heroMovie.adult,
                                      backdrop_path: heroMovie.backdrop_path,
                                      id: heroMovie.id,
                                      genre_ids: heroMovie.genre_ids,
                                      original_language:
                                        heroMovie.original_language,
                                      original_title: heroMovie.original_title,
                                      overview: heroMovie.overview,
                                      popularity: heroMovie.popularity,
                                      poster_path: heroMovie.poster_path,
                                      release_date: heroMovie.release_date,
                                      title: heroMovie.title,
                                      video: heroMovie.video,
                                      vote_average: heroMovie.vote_average,
                                      vote_count: heroMovie.vote_count,
                                    }}
                                    watchlistId={friendWatchlist.id}
                                    movieWatchProviders={whereToWatch?.flatrate}
                                  />
                                ) : (
                                  <Button disabled>In watchlist</Button>
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
        <div className="flex gap-4">
          <EmblaCarousel movies={popularMovies.results} options={OPTIONS} />
        </div>
      </div>
    </main>
  );
}
