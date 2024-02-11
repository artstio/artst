import { Prisma, SpotifyArtist } from "@prisma/client";
import { db } from "~/utils/db.server";

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
  include: { images: true; spotifyAlbum: true };
}>;
