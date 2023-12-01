"use client";

import {
  Tabs,
  Tab,
  Card,
  CardFooter,
  Link,
  Avatar,
  CardBody,
  CardHeader,
  Chip,
} from "@nextui-org/react";
import Image from "next/image";
import { type MovieBrief } from "~/types/MovieBrief";
import { type MovieReview } from "~/types/MovieReview";
import { buildPosterImageURL, buildProfileURL } from "~/util/buildImageURLs";
import Markdown from "react-markdown";
import StarIcon from "./Icons/Star";
import { formatDateString } from "~/util/convertDateString";
import getRandomAvatarColor from "~/util/getRandomAvatarColor";
import { type Actor } from "~/types/Actor";

type Props = {
  simularMovies: MovieBrief[];
  reviews: MovieReview[];
  cast: Actor[];
};

export default function MovieDetailTabs({
  simularMovies,
  reviews,
  cast,
}: Props) {
  return (
    <Tabs
      key="More"
      color="primary"
      aria-label="Tabs colors"
      radius="full"
      disableAnimation
    >
      <Tab key="simular" title="Related">
        <p className="my-4 text-4xl font-bold">Related Movies</p>
        <div className="grid w-fit grid-cols-6 gap-4">
          {simularMovies.map((movie, index) => (
            <Link href={`/movie/${movie.id}`} key={index}>
              <Card
                isFooterBlurred
                key={index}
                className="col-span-12 h-[300px] w-fit cursor-pointer sm:col-span-5"
              >
                <Image
                  height={300}
                  width={200}
                  alt="Card example background"
                  className="z-0  -translate-y-6 scale-125 object-cover"
                  src={buildPosterImageURL("w500", movie.poster_path)}
                />
                <CardFooter className="absolute bottom-0 z-10 justify-between border-t-1 border-zinc-100/50 bg-white/30">
                  <p className="line-clamp-1 font-bold text-black">
                    {movie.title}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </Tab>
      <Tab key="reviews" title="Reviews">
        <div className="mt-8">
          {reviews.map((review, index) => (
            <Card
              shadow="none"
              key={index}
              className="mb-2 max-w-[600px] border-none bg-transparent"
            >
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar
                    isBordered
                    showFallback
                    radius="full"
                    color={getRandomAvatarColor()}
                    size="md"
                    name={review.author.charAt(0)}
                    src={buildProfileURL(
                      "w45",
                      review.author_details.avatar_path,
                    )}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {review.author}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-500">
                      {review.author_details.username}
                    </h5>
                  </div>
                </div>
                <Chip>
                  <div className="flex items-center">
                    {review.author_details.rating} <StarIcon />
                  </div>
                </Chip>
              </CardHeader>
              <CardBody className="px-3 py-0">
                <p className="pl-px text-small text-default-500">
                  <Markdown>{review.content}</Markdown>
                </p>
              </CardBody>
              <CardFooter className="gap-3">
                <div className="flex gap-1">
                  <p className="text-small font-semibold text-default-600">
                    Written on:
                  </p>
                  <p className=" text-small text-default-500">
                    {formatDateString(review.created_at)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tab>
      <Tab key="cast" title="Cast">
        <p className="my-4 text-4xl font-bold">Top Billed Actors</p>
        <div className="grid w-fit grid-cols-2 gap-4 sm:grid-cols-5">
          {cast.map((actor, index) => (
            <Link href={`/actor/${actor.id}`} key={index}>
              <Card
                shadow="sm"
                isPressable
                className="w-[185px]"
                onPress={() => console.log("item pressed")}
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    width={185}
                    height={300}
                    alt={actor.name}
                    className="h-full w-[185px] object-cover"
                    src={buildProfileURL("w185", actor.profile_path)}
                  />
                </CardBody>
                <CardFooter className="flex-col justify-start text-small">
                  <b>{actor.name}</b>
                  <p className="text-default-500">{actor.character}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </Tab>
    </Tabs>
  );
}
