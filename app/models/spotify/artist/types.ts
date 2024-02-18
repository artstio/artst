import type { Prisma, SpotifyArtist } from "@prisma/client";

import type { db } from "~/utils/db.server";

export type ArtistCreateBody = Prisma.Args<
  typeof db.spotifyArtist,
  "create"
>["data"];
export type ArtistUpdateBody = Prisma.Args<
  typeof db.spotifyArtist,
  "update"
>["data"];
export type PrismaArtist = SpotifyArtist;
export type ArtistAggregateData = Prisma.SpotifyArtistGetPayload<{
  include: {
    images: true;
    spotifyAlbum: {
      include: {
        images: true;
      };
    };
  };
}>;

const a = [{ createdAt: "2022-01-01" }];
const b = [{ createdAt: "1999-01-01" }];

const sorted = a
  .concat(b)
  .sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
