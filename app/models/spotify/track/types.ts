import type { Prisma } from "@prisma/client";

import type { db } from "~/utils/db.server";
import type { MaybeJsonified } from "~/utils/types";

export type TrackCreateBody = Prisma.Args<
  typeof db.spotifyTrack,
  "create"
>["data"];
export type TrackUpdateBody = Prisma.Args<
  typeof db.spotifyTrack,
  "update"
>["data"];
export type TrackAggregateData = Prisma.SpotifyTrackGetPayload<{
  include: {
    spotifyAlbum: {
      include: {
        images: true;
      };
    };
    spotifyArtists: {
      include: {
        images: true;
      };
    };
  };
}>;

export type TrackAggregateProps = MaybeJsonified<TrackAggregateData>;
