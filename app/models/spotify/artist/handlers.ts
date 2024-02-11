import { Artist } from "@spotify/web-api-ts-sdk";

import { spotify } from "~/services/spotify";
import { db } from "~/utils/db.server";

import { createArtistInput } from "./transformers";
import { ArtistCreateBody, ArtistUpdateBody, PrismaArtist } from "./types";

export async function getArtist(id: string) {
  return spotify.artists.get(id);
}

export async function getArtistFromDb(id: string) {
  try {
    return await db.spotifyArtist.findFirst({
      where: {
        id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }
}

export async function getCachedArtist(id: string) {
  const artist = await getArtistFromDb(id);
  if (artist) {
    return artist;
  }

  const spotifyArtist = await getArtist(id);
  if (spotifyArtist) {
    const body = createArtistInput(spotifyArtist);
    return createArtist(body);
  }

  return null;
}

export async function searchArtist(query: string) {
  return spotify.search(query, ["artist"]);
}

export async function createArtist(body: ArtistCreateBody) {
  return db.spotifyArtist.create({
    data: body,
  });
}

export async function updateArtist(id: string, body: ArtistUpdateBody) {
  return db.spotifyArtist.update({
    where: {
      id,
    },
    data: body,
  });
}
