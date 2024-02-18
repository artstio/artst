import type { Prisma } from "@prisma/client";

import type { db } from "~/utils/db.server";
import type { MaybeJsonified } from "~/utils/types";

export type AlbumCreateBody = Prisma.Args<
  typeof db.spotifyAlbum,
  "create"
>["data"];
export type AlbumUpdateBody = Prisma.Args<
  typeof db.spotifyAlbum,
  "update"
>["data"];
export type AlbumAggregateData = Prisma.SpotifyAlbumGetPayload<{
  include: {
    images: true;
    tracks: {
      include: {
        spotifyArtists: {
          include: { images: true };
        };
      };
    };
    artists: {
      include: { images: true };
    };
  };
}>;

export type AlbumAggregateProps = MaybeJsonified<AlbumAggregateData>;
