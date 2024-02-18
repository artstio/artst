import type { SpotifyArtist } from "@prisma/client";
import type { Artist } from "@spotify/web-api-ts-sdk";
import slugify from "slugify";

import { spotify } from "~/services/spotify";
import { extractImageId } from "../image/utils";
import type { ArtistCreateBody, ArtistUpdateBody } from "./types";

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
) => {
  const shouldUpdatePopularity =
    existingArtist.popularity !== artist.popularity;
  const shouldUpdateFollowers =
    existingArtist.followers !== artist.followers.total;

  return {
    popularity: artist.popularity,
    popularityHistory: shouldUpdatePopularity
      ? {
          create: {
            popularity: artist.popularity,
          },
        }
      : undefined,
    followers: artist.followers.total,
    followersHistory: shouldUpdateFollowers
      ? {
          create: {
            followers: artist.followers.total,
          },
        }
      : undefined,
    // spotifyAlbum: {
    //   connectOrCreate: artist.items.map((album) => ({
    //     where: {
    //       id: album.id,
    //     },
    //     create: {
    //       id: album.id,
    //       name: album.name,
    //       apiHref: album.href,
    //       spotifyUrl: album.external_urls.spotify,
    //       slug: slugify(album.name, { lower: true }),
    //       popularity: album.popularity,
    //       popularityHistory: {
    //         create: {
    //           popularity: album.popularity || 0,
    //         },
    //       },
    //       images: album.images?.length
    //         ? {
    //             createMany: {
    //               data: album.images.map((image) => ({
    //                 id: `${extractImageId(image.url)}:${image.width}:${image.height}`,
    //                 url: image.url,
    //                 width: image.width,
    //                 height: image.height,
    //               })),
    //             },
    //           }
    //         : undefined,
    //       releaseDate: album.release_date,
    //       tracks: {
    //         connectOrCreate: album.tracks.items.map((track) => ({
    //           where: {
    //             id: track.id,
    //           },
    //           create: {
    //             id: track.id,
    //             name: track.name,
    //             apiHref: track.href,
    //             spotifyUrl: track.external_urls.spotify,
    //             slug: slugify(track.name, { lower: true }),
    //             popularity: track.popularity,
    //             popularityHistory: {
    //               create: {
    //                 popularity: track.popularity || 0,
    //               },
    //             },
    //             durationMs: track.duration_ms,
    //             previewUrl: track.preview_url,
    //             explicit: track.explicit,
    //             images: track.album.images?.length
    //               ? {
    //                   createMany: {
    //                     data: track.album.images.map((image) => ({
    //                       id: `${extractImageId(image.url)}:${image.width}:${image.height}`,
    //                       url: image.url,
    //                       width: image.width,
    //                       height: image.height,
    //                     })),
    //                   },
    //                 }
    //               : undefined,
    //           },
    //         })),
    //       },
    //     },
    //   })),
    // }
  };
};
