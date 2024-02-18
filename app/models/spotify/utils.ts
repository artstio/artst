import type { ImageProps } from "./image/types";

export function getSmallestImage(images?: ImageProps[]) {
  if (!images || !images.length) {
    return;
  }
  return images.reduce((smallest, current) => {
    if (current.width < smallest.width) {
      return current;
    }
    return smallest;
  });
}

export function getLargestImage(images?: ImageProps[]) {
  if (!images || !images.length) {
    return;
  }
  return images.reduce((largest, current) => {
    if (current.width > largest.width) {
      return current;
    }
    return largest;
  });
}

export const isRecentRelease = (releaseDate: string | number | Date) =>
  new Date(releaseDate) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days

export const MIN_EP_TRACKS = 4;
export const MAX_EP_TRACKS = 6;
export const isEp = (trackCount: number) =>
  trackCount > MIN_EP_TRACKS && trackCount < MAX_EP_TRACKS;

export const getAlbumTypeText = (album: {
  albumType: string;
  trackCount: number;
}) => {
  if (album.albumType === "album") {
    return "Album";
  }
  if (isEp(album.trackCount)) {
    return "EP";
  }
  return "Single";
};

export function getReleaseDate(releaseDate: string | Date) {
  const date = new Date(releaseDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDuration(ms: number) {
  // returns mins and seconds
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`;
}
