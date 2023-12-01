import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Image,
} from "@nextui-org/react";
import StarIcon from "~/app/_components/Icons/Star";
import MovieDetailTabs from "~/app/_components/movie-detail-tabs";
import { PopoverCard } from "~/app/_components/popover-card";
import {
  buildBackdropImageURL,
  buildLogoURL,
  buildPosterImageURL,
} from "~/util/buildImageURLs";
import fetchMovieByID from "~/util/queries/fetchMovieByID";
import fetchMovieCredits from "~/util/queries/fetchMovieCredits";
import fetchMovieReviews from "~/util/queries/fetchMovieReviews";
import fetchMovieWatchProviders from "~/util/queries/fetchMovieWatchProviders";
import fetchSimularMovies from "~/util/queries/fetchSimularMovies";

export default async function Page({ params }: { params: { id: string } }) {
  const movie = await fetchMovieByID(params.id);
  const coverImage = buildBackdropImageURL("w1280", movie.backdrop_path);

  const simularMovies = await fetchSimularMovies(params.id);
  const movieReviews = await fetchMovieReviews(params.id);
  const movieCredits = await fetchMovieCredits(params.id);
  const whereToWatch = await fetchMovieWatchProviders(params.id);

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
        <div className="flex justify-center gap-8">
          <Image
            src={buildPosterImageURL("w342", movie?.poster_path)}
            width={250}
            height={750}
            alt={""}
          />
          <div className="flex w-3/5 flex-col gap-4">
            <div>
              <p className="mb-2 text-6xl font-bold">{movie.title}</p>
              <p className="text-2xl font-semibold">{movie.tagline}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-l font-medium">{movie.release_date}</p>
              <div className="text-l flex items-center font-medium">
                {movie.vote_average.toFixed()} <StarIcon />
              </div>
              <div className="flex">
                {movie.genres.map((genre, key) => (
                  <div className="flex w-fit text-white" key={key}>
                    {genre.name}
                    {key !== movie.genres.length - 1 && (
                      <p className="px-2">•</p>
                    )}
                  </div>
                ))}
              </div>
              <Chip>{movie.runtime} minutes</Chip>
            </div>
            {whereToWatch?.flatrate && (
              <div className="flex flex-col gap-2">
                <p className="text-large">Stream on</p>
                <div className="flex gap-2">
                  {whereToWatch.flatrate.map((provider, index) => (
                    <Image
                      src={buildLogoURL("w45", provider.logo_path)}
                      width={45}
                      height={45}
                      alt={""}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-2xl font-semibold">Overview</p>
              <p className="text-l font-medium">{movie.overview}</p>
            </div>
            <div className="flex gap-2">
              <Button color="primary">Add to Watchlist</Button>

              <Popover showArrow placement="bottom">
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
