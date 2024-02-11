import { Track, SimplifiedTrack } from "@spotify/web-api-ts-sdk";
import slugify from "slugify";
import { TrackCreateBody } from "./types";

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
