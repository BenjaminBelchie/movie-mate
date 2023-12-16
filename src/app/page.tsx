import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Nav from "./_components/navbar";
import { Button } from "@nextui-org/react";
import EmblaCarousel from "~/app/_components/Carousel/embla-carousel";
import { type EmblaOptionsType } from "embla-carousel-react";
import StarIcon from "./_components/Icons/Star";
import Link from "next/link";
import fetchPopularMovies from "~/util/queries/fetchPopularMovies";
import getRandomMovie from "~/util/getRandomMovie";
import { buildBackdropImageURL } from "~/util/buildImageURLs";
import getMovieGenres from "~/util/getMovieGenres";
import SharePopover from "./_components/ShareMovie/share-popover";

export default async function Home() {
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
                {genres.slice(0, 3).map((genre, key) => (
                  <div className="flex w-fit text-white" key={key}>
                    {genre}
                    {key !== genres.slice(0, 3).length - 1 && (
                      <p className="px-2">•</p>
                    )}
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
              {heroMovie && (
                <SharePopover friends={friends} movie={heroMovie} />
              )}
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
