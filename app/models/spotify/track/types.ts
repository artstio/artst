import { Prisma } from "@prisma/client";

import { db } from "~/utils/db.server";
import { MaybeJsonified } from "~/utils/types";

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
    spotifyArtists: {
      include: {
        images: true;
      };
    };
  };
}>;

export type TrackAggregateProps = MaybeJsonified<TrackAggregateData>;
