"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function ProductDescription() {
  return (
    <Accordion variant="splitted">
      <AccordionItem key="1" aria-label="Overview" title="Overview">
        <div className="flex flex-col gap-4 pb-4">
          <p className="text-gray-300">
            Movie Mate is your Ultimate Movie Companion! Elevate your
            movie-watching experience with Movie Mate, the must-have web app for
            film enthusiasts! Whether you're a cinephile or just love a good
            movie night, Movie Mate is here to revolutionize the way you
            discover, track, and share your favorite films.
          </p>
          <p className="text-gray-300">
            Dive into a vast database of movies and effortlessly search for your
            favorite films or discover new ones. Movie Mate's intuitive
            interface ensures a seamless browsing experience, making it easier
            than ever to find the perfect movie for any occasion. Never miss a
            movie again! With Movie Mate, you can create and manage your
            personalized watchlist. Add movies you want to watch, and the app
            will keep you updated on their availability, ensuring you're always
            in the loop about the latest releases.
          </p>
          <p className="text-gray-300">
            Connect with friends and turn your movie nights into a shared
            experience! Movie Mate lets you add friends to your network,
            creating a vibrant community of film enthusiasts. Share your
            thoughts, recommendations, and engage in lively discussions about
            your favorite movies. Take your movie-sharing experience to the next
            level! Once you've added friends, Movie Mate allows you to
            contribute to each other's watchlists. Recommend hidden gems,
            classics, or the latest blockbusters directly to your friends'
            watchlists, fostering a collaborative movie-watching environment.
          </p>
          <p>
            Stay in the know with real-time updates on your friends' activities.
            See what movies they've added to their watchlists, get notified
            about their reviews, and discover shared interests that spark
            exciting conversations.
          </p>
        </div>
      </AccordionItem>
      <AccordionItem key="2" aria-label="Features" title="Features">
        <div className="flex flex-col gap-4 pb-4">
          <div>
            <p className="text-2xl font-semibold">Find Movies</p>
            <p className="text-gray-300">
              Search for the movies that you have watched or want to watch,
              Movie Mate's movie collection is community driven and all movie
              data is sourced from the{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                className="text-blue-500 underline"
                rel="noopener noreferrer"
              >
                The Movie DB
              </a>
              . To find movies you can search for them or browse the homepage
              for latest and trending movies. Once you have found your movie,
              Movie Mate makes your life easier by telling you if you can watch
              that movie on any streaming platforms such as Netflix, Disney Plus
              or Amazon Prime.
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">Add Friends</p>
            <p className="text-gray-300">
              Invite your friends to join Movie Mate, once they have joined you
              can add them as a friend and share your favourite movies! To share
              movies you can simply add the movie to thier personalized
              watchlist, they will be notified and see that you have added the
              movie.
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">Build your Watchlist</p>
            <p className="text-gray-300">
              Each Movie Mate user has an individualized watchlist, serving as a
              curated repository for movies contributed by both the user and
              their friends. This feature establishes a comprehensive catalog of
              desired films, fostering a seamless avenue for friends to provide
              thoughtful movie recommendations.
            </p>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
