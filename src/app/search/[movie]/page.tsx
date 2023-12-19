import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import Pagination from "~/app/_components/pagination";
import searchForMovies from "~/util/queries/searchForMovies";
import Image from "next/image";
import { buildPosterImageURL } from "~/util/buildImageURLs";
import StarIcon from "~/app/_components/Icons/Star";
import Link from "next/link";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type Prisma } from "@prisma/client";
import MobileSharePopover from "~/app/_components/ShareMovie/mobile-share-popover";
import SharePopover from "~/app/_components/ShareMovie/share-popover";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { movie: string };
  searchParams: Record<string, string | undefined>;
}) {
  const searchResult = await searchForMovies(
    params.movie.replace(/\s/g, "%20"),
    searchParams.page ? parseInt(searchParams.page) : 1,
  );
  const session = await getServerAuthSession();
  let friends:
    | Prisma.FriendGetPayload<{ include: { friend: true } }>[]
    | undefined;
  if (session) {
    friends = await api.friend.findUserFriends.query();
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col p-4 md:w-3/5 md:p-0">
        <div className="my-8 hidden md:block ">
          <h1 className="text-3xl font-bold">
            Search Results For: {params.movie.replace(/-/g, " ")}
          </h1>
        </div>
        <div className="my-8 block md:hidden">
          <h1 className=" text-3xl font-bold">Search Results For:</h1>
          <h2 className="text-2xl font-semibold">
            {params.movie.replace(/-/g, " ")}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          {searchResult.results.map((movie, index) => (
            <Card
              key={index}
              className=" border-none bg-background/60 dark:bg-default-100/50"
              shadow="sm"
            >
              <CardBody>
                <div className="flex gap-6">
                  <Image
                    unoptimized
                    alt={movie.title}
                    className="object-cover"
                    height={200}
                    src={
                      movie.poster_path
                        ? buildPosterImageURL("w154", movie.poster_path)
                        : "/no-image.jpg"
                    }
                    width={154}
                  />

                  <div className="flex w-full items-start justify-between">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex w-full flex-col gap-0">
                        <h3 className="line-clamp-2 text-2xl font-semibold md:line-clamp-none">
                          <Link href={`/movie/${movie.id}`}>{movie.title}</Link>
                        </h3>
                        <div className=" flex flex-col gap-1 md:flex-row md:gap-4">
                          <div className="flex flex-row items-center gap-2 md:flex-row md:gap-3">
                            <h5 className="text-small tracking-tight text-default-400">
                              {movie.release_date}
                            </h5>
                            <div className="flex gap-2 text-white">
                              <Chip
                                size="sm"
                                classNames={{ content: "flex items-center" }}
                              >
                                {movie.vote_average.toFixed()}
                                <StarIcon />
                              </Chip>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-medium font-medium md:line-clamp-5">
                          {movie.overview}
                        </p>
                      </div>
                      <div className="mt-2 flex gap-2 md:mb-2 md:mt-0">
                        {/* Desktop */}
                        <Button className="hidden md:block" color="primary">
                          <Link href={`/movie/${movie.id}`}>See Movie</Link>
                        </Button>

                        {/* Movile */}
                        <Button
                          className="block md:hidden"
                          size="sm"
                          color="primary"
                        >
                          <Link href={`/movie/${movie.id}`}>See Movie</Link>
                        </Button>

                        <div className="hidden md:block">
                          <SharePopover friends={friends} movie={movie} />
                        </div>
                        <div className="block md:hidden">
                          <MobileSharePopover friends={friends} movie={movie} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <br />
        <Pagination totalPages={searchResult.total_pages} />
      </div>
    </div>
  );
}
