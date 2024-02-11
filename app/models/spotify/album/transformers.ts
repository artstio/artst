import { Album, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import slugify from "slugify";

import { extractImageId } from "../image/utils";

import { AlbumCreateBody } from "./types";

export const createAlbumInput = (album: Album): AlbumCreateBody => {
  return {
    id: album.id,
    name: album.name,
    slug: slugify(album.name, { lower: true }),
    albumType: album.album_type,
    apiHref: album.href,
    spotifyUrl: album.external_urls.spotify,
    type: album.type,
    releaseDate: new Date(album.release_date),
    releaseDatePrecision: album.release_date_precision,
    trackCount: album.total_tracks,
    label: album.label,
    popularity: album.popularity,
    ...(album.external_ids?.upc && { upc: album.external_ids.upc }),
    ...(album.external_ids?.ean && { ean: album.external_ids.ean }),
    ...(album.external_ids?.isrc && { isrc: album.external_ids.isrc }),
    artists: {
      connectOrCreate: album.artists.map((artist) => {
        return {
          where: {
            id: artist.id,
          },
          create: {
            id: artist.id,
            name: artist.name,
            slug: slugify(artist.name, { lower: true }),
            apiHref: artist.href,
            spotifyUrl: artist.external_urls.spotify,
            popularity: artist.popularity,
            followers: artist.followers?.total || 0,
            images: artist.images
              ? {
                  createMany: {
                    skipDuplicates: true,
                    data: artist.images?.map((image) => {
                      return {
                        id: extractImageId(image.url),
                        url: image.url,
                        width: image.width,
                        height: image.height,
                      };
                    }),
                  },
                }
              : undefined,
            popularityHistory: {
              create: {
                popularity: artist.popularity,
              },
            },
            followersHistory: {
              create: {
                followers: artist.followers?.total || 0,
              },
            },
          },
        };
      }),
    },
    copyrights: {
      createMany: {
        skipDuplicates: true,
        data: album.copyrights.map((copyright) => {
          return {
            text: copyright.text,
            type: copyright.type,
          };
        }),
      },
    },
    images: {
      createMany: {
        skipDuplicates: true,
        data: album.images.map((image) => {
          return {
            id: extractImageId(image.url),
            url: image.url,
            width: image.width,
            height: image.height,
          };
        }),
      },
    },
    popularityHistory: {
      create: {
        popularity: album.popularity,
      },
    },
  };
};

export const createSimplifiedAlbumInput = (
  artistId: string,
  album: SimplifiedAlbum
): AlbumCreateBody => {
  return {
    id: album.id,
    name: album.name,
    slug: slugify(album.name, { lower: true }),
    albumType: album.album_type,
    apiHref: album.href,
    spotifyUrl: album.external_urls.spotify,
    type: album.type,
    releaseDate: new Date(album.release_date),
    releaseDatePrecision: album.release_date_precision,
    label: album.label,
    trackCount: album.total_tracks,
    popularity: album.popularity,
    popularityHistory: {
      create: {
        popularity: album.popularity || 0,
        artist: {
          connect: {
            id: artistId,
          },
        },
      },
    },
    copyrights: {
      createMany: {
        skipDuplicates: true,
        data: album.copyrights.map((copyright) => {
          return {
            text: copyright.text,
            type: copyright.type,
          };
        }),
      },
    },

    ...(album.external_ids?.upc && { upc: album.external_ids.upc }),
    ...(album.external_ids?.ean && { ean: album.external_ids.ean }),
    ...(album.external_ids?.isrc && { isrc: album.external_ids.isrc }),
  };
};

// export const updateArtistInput = (
// 	artist: Artist,
// 	existingArtist: SpotifyArtist,
// ): ArtistUpdateBody => {
// 	const shouldUpdatePopularity = existingArtist.popularity !== artist.popularity;
// 	const shouldUpdateFollowers = existingArtist.followers !== artist.followers.total;

// 	return {
// 		popularity: shouldUpdatePopularity ? artist.popularity : undefined,
// 		popularityHistory: shouldUpdatePopularity
// 			? {
// 					create: {
// 						popularity: artist.popularity,
// 					},
// 			  }
// 			: undefined,

// 		followers: shouldUpdateFollowers ? artist.followers.total : undefined,
// 		followersHistory: shouldUpdateFollowers
// 			? {
// 					create: {
// 						followers: artist.followers.total,
// 					},
// 			  }
// 			: undefined,
// 	};
// };
