export function buildBackdropImageURL(
  width: "w300" | "w780" | "w1280" | "original",
  path?: string,
) {
  return `https://image.tmdb.org/t/p/${width}${path}`;
}

export function buildPosterImageURL(
  width: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original",
  path: string,
) {
  return `https://image.tmdb.org/t/p/${width}${path}`;
}

export function buildProfileURL(
  width: "w45" | "w185" | "h632" | "original",
  path: string | null,
) {
  return `https://image.tmdb.org/t/p/${width}${path}`;
}

export function buildLogoURL(
  width: "w45" | "w92" | "w154" | "w185" | "w300" | "w500" | "original",
  path: string | null,
) {
  return `https://image.tmdb.org/t/p/${width}${path}`;
}
