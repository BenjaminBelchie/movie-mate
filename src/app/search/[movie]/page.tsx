import {
  Card,
  CardBody,
  Button,
  Slider,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import Pagination from "~/app/_components/pagination";
import searchForMovies from "~/util/queries/searchForMovies";
import Image from "next/image";
import { buildPosterImageURL } from "~/util/buildImageURLs";
import StarIcon from "~/app/_components/Icons/Star";
import { PopoverCard } from "~/app/_components/popover-card";
import Link from "next/link";
import { HeartIcon } from "~/app/_components/Icons/HeartIcon";

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
                        <div className="flex justify-between">
                          <h3 className="line-clamp-2 text-2xl font-semibold md:line-clamp-none">
                            <Link href={`/movie/${movie.id}`}>
                              {movie.title}
                            </Link>
                          </h3>
                          <Button
                            isIconOnly
                            className="-translate-y-2 translate-x-2 text-default-900/60 data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
                          >
                            <HeartIcon className={""} fill={"none"} />
                          </Button>
                        </div>
                        <div className="mt-2 flex flex-col gap-1 md:mt-0 md:flex-row md:gap-4">
                          <div className="flex flex-col md:flex-row md:gap-4">
                            {movie.release_date}
                            <div className="flex gap-2 text-white">
                              <p>Voted </p>
                              <Chip
                                classNames={{ content: "flex items-center" }}
                              >
                                {movie.vote_average.toFixed()}
                                <StarIcon />
                              </Chip>
                              <p className="hidden md:block">
                                By {movie.vote_count} People
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-3 text-medium font-medium">
                          {movie.overview}
                        </p>
                      </div>
                      <div className="mb-4 hidden gap-2 md:flex">
                        <Button color="primary">
                          <Link href={`/movie/${movie.id}`}>See Movie</Link>
                        </Button>

                        <Popover showArrow placement="right">
                          <PopoverTrigger>
                            <Button color="secondary">Share</Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-1">
                            <PopoverCard />
                          </PopoverContent>
                        </Popover>
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
