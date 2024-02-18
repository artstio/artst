import type { SimplifiedTrack, Track } from "@spotify/web-api-ts-sdk";
import slugify from "slugify";

import type { TrackCreateBody } from "./types";

export const createTrackInput = (track: Track): TrackCreateBody => {
  return {
    id: track.id,
    name: track.name,
    slug: slugify(track.name, { lower: true }),
    trackNumber: track.track_number,
    durationMs: track.duration_ms,
    previewUrl: track.preview_url,
    apiHref: track.href,
    explicit: track.explicit,
    spotifyUrl: track.external_urls.spotify,
    spotifyAlbum: {
      connect: {
        id: track.album.id,
      },
    },
  };
};

export const createSimplifiedTrackInput = (
  track: SimplifiedTrack
): Omit<TrackCreateBody, "spotifyAlbum" | "spotifyAlbumId"> => {
  return {
    id: track.id,
    name: track.name,
    slug: slugify(track.name, { lower: true }),
    trackNumber: track.track_number,
    durationMs: track.duration_ms,
    previewUrl: track.preview_url,
    apiHref: track.href,
    explicit: track.explicit,
    spotifyUrl: track.external_urls.spotify,
    // spotifyArtists: {
    //   connectOrCreate: track.artists.map((artist) => ({
    //     where: {
    //       id: artist.id,
    //     },
    //     create: {
    //       id: artist.id,
    //       name: artist.name,
    //       slug: slugify(artist.name, { lower: true }),
    //       apiHref: artist.href,
    //       spotifyUrl: artist.external_urls.spotify,
    //       popularity: 0,
    //       followers: 0,
    //       popularityHistory: {
    //         create: {
    //           popularity: 0,
    //         },
    //       },
    //       followersHistory: {
    //         create: {
    //           followers: 0,
    //         },
    //       },
    //     },
    //   })),
    // },
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
