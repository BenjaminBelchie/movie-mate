import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Nav from "./_components/navbar";
import axios from "axios";
import { env } from "~/env";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import EmblaCarousel from "~/app/_components/Carousel/embla-carousel";
import { type EmblaOptionsType } from "embla-carousel-react";
import { type GenreResponse } from "~/types/Responses/Genre";
import StarIcon from "./_components/Icons/Star";
import Link from "next/link";
import fetchPopularMovies from "~/util/queries/fetchPopularMovies";
import fetchMovieGenres from "~/util/queries/fetchMovieGenres";
import getRandomMovie from "~/util/getRandomMovie";
import { buildBackdropImageURL } from "~/util/buildImageURLs";
import getMovieGenres from "~/util/getMovieGenres";
import { PopoverCard } from "./_components/popover-card";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  const popularMovies = await fetchPopularMovies();
  const heroMovie = getRandomMovie(popularMovies.results);
  const genres = await getMovieGenres(heroMovie);

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
                  <Button color="secondary" className="w-fit">
                    Share
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  <PopoverCard />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <EmblaCarousel movies={popularMovies.results} options={OPTIONS} />
        </div>
      </div>
      {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div> */}
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
