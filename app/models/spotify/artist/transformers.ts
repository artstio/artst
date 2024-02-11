import { Artist } from "@spotify/web-api-ts-sdk";
import slugify from "slugify";
import { ArtistCreateBody, ArtistUpdateBody } from "./types";
import { SpotifyArtist } from "@prisma/client";
import { extractImageId } from "../image/utils";

export const createArtistInput = (artist: Artist): ArtistCreateBody => {
  return {
    id: artist.id,
    name: artist.name,
    apiHref: artist.href,
    spotifyUrl: artist.external_urls.spotify,
    slug: slugify(artist.name, { lower: true }),
    popularity: artist.popularity,
    popularityHistory: {
      create: {
        popularity: artist.popularity || 0,
      },
    },
    images: artist.images?.length
      ? {
          createMany: {
            data: artist.images.map((image) => ({
              id: `${extractImageId(image.url)}:${image.width}:${image.height}`,
              url: image.url,
              width: image.width,
              height: image.height,
            })),
          },
        }
      : undefined,
    followers: artist.followers.total,
    followersHistory: {
      create: {
        followers: artist.followers.total,
      },
    },
  };
};

export const updateArtistInput = (
  artist: Artist,
  existingArtist: SpotifyArtist
): ArtistUpdateBody => {
  const shouldUpdatePopularity =
    existingArtist.popularity !== artist.popularity;
  const shouldUpdateFollowers =
    existingArtist.followers !== artist.followers.total;

  return {
    popularity: shouldUpdatePopularity ? artist.popularity : undefined,
    popularityHistory: shouldUpdatePopularity
      ? {
          create: {
            popularity: artist.popularity,
          },
        }
      : undefined,

    followers: shouldUpdateFollowers ? artist.followers.total : undefined,
    followersHistory: shouldUpdateFollowers
      ? {
          create: {
            followers: artist.followers.total,
          },
        }
      : undefined,
  };
};
