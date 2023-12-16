import { type Prisma, type WatchProvider } from "@prisma/client";

export const convertWatchlistProvidersToWatchproviders = (
  watchlistItem: Prisma.FilmOnWatchlistGetPayload<{
    include: {
      film: { include: { watchProviders: { include: { provider: true } } } };
    };
  }>,
): WatchProvider[] => {
  return watchlistItem.film.watchProviders.map((watchlistProvider) => {
    return {
      provider_id: watchlistProvider.provider.provider_id,
      logo_path: watchlistProvider.provider.logo_path,
      provider_name: watchlistProvider.provider.provider_name,
    };
  });
};
