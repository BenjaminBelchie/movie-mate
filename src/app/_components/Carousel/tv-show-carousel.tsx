"use client";
import React from "react";
import useEmblaCarousel, { type EmblaOptionsType } from "embla-carousel-react";
import { Card, CardFooter, Image } from "@nextui-org/react";
import Link from "next/link";
import { buildPosterImageURL } from "~/util/buildImageURLs";
import { type TVShowBrief } from "~/types/TVShowBrief";

type PropType = {
  shows: TVShowBrief[];
  options?: EmblaOptionsType;
};

const TVShowCarousel: React.FC<PropType> = (props) => {
  const { shows, options } = props;
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {shows.map((show, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <span>{index + 1}</span>
              </div>
              <Link href={`/show/${show.id}`}>
                <Card
                  isFooterBlurred
                  key={index}
                  className="col-span-12 h-[300px] w-fit cursor-pointer sm:col-span-5"
                >
                  <Image
                    removeWrapper
                    alt="Card example background"
                    className="z-0 h-full w-full -translate-y-6 scale-125 object-cover"
                    src={buildPosterImageURL("w500", show.poster_path)}
                  />
                  <CardFooter className="absolute bottom-0 z-10 justify-between border-t-1 border-zinc-100/50 bg-white/30">
                    <p className="line-clamp-1 font-bold text-black">
                      {show.name}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShowCarousel;
