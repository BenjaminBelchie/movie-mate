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
      <div className="flex w-3/5 flex-col">
        <h1 className="my-8 text-3xl font-bold">
          Search Results For: {params.movie.replace(/-/g, " ")}
        </h1>
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
                        <h3 className="text-2xl font-semibold">
                          <Link href={`/movie/${movie.id}`}>{movie.title}</Link>
                        </h3>
                        <div className="flex flex-col gap-1 md:flex-row md:gap-4">
                          <div className="flex gap-4">
                            {movie.release_date}
                            <div className="flex gap-2 text-white">
                              <p>Voted </p>
                              <Chip
                                classNames={{ content: "flex items-center" }}
                              >
                                {movie.vote_average.toFixed()}
                                <StarIcon />
                              </Chip>
                              <p>By {movie.vote_count} People</p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-3 text-medium font-medium">
                          {movie.overview}
                        </p>
                      </div>
                      <div className="mb-4 flex gap-2">
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
                    <Button
                      isIconOnly
                      className="-translate-y-2 translate-x-2 text-default-900/60 data-[hover]:bg-foreground/10"
                      radius="full"
                      variant="light"
                    >
                      <HeartIcon className={""} fill={"none"} />
                    </Button>
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

export const HeartIcon = ({
  size = 24,
  strokeWidth = 1.5,
  fill = "none",
  ...props
}) => (
  <svg
    aria-hidden="true"
    fill={fill}
    focusable="false"
    height={size}
    role="presentation"
    viewBox="0 0 24 24"
    width={size}
    {...props}
  >
    <path
      d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
