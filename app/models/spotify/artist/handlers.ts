import { Artist } from "@spotify/web-api-ts-sdk";

import { db } from "~/utils/db.server";
import { spotify } from "~/services/spotify";
import { createArtistInput, updateArtistInput } from "./transformers";
import type {
  ArtistAggregateData,
  ArtistCreateBody,
  ArtistUpdateBody,
} from "./types";

export async function getArtist(id: string) {
  return spotify.artists.get(id);
}

export async function getArtistFromDb(input: GetCachedArtist) {
  try {
    return await db.spotifyArtist.findFirst({
      where: {
        ...(input.id ? { id: input.id } : { slug: input.slug }),
      },
      include: {
        spotifyAlbum: {
          take: 10,
          orderBy: {
            releaseDate: "desc",
          },
          include: { images: true },
        },
        images: true,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }
}

type GetCachedArtist =
  | {
      id: string;
      slug?: never;
    }
  | {
      slug: string;
      id?: never;
    };

export async function getCachedArtist(
  input: GetCachedArtist
): Promise<ArtistAggregateData | undefined> {
  const artist = await getArtistFromDb(input);
  if (
    artist?.id &&
    artist.updatedAt > new Date(Date.now() - 1000 * 60 * 60 * 24)
  ) {
    return artist;
  }

  const inputId = artist?.id || input.id;
  if (!inputId) {
    throw new Error(
      JSON.stringify({ message: "Artist not found", status: 404 })
    );
  }
  const spotifyArtist = await getArtist(inputId);
  if (spotifyArtist && !artist) {
    const body = createArtistInput(spotifyArtist);
    return createArtist(body);
  }

  if (spotifyArtist && artist) {
    const body = updateArtistInput(spotifyArtist, artist);
    return updateArtist(artist.id, body);
  }

  return;
}

export async function searchArtist(query: string) {
  return spotify.search(query, ["artist"]);
}

export async function createArtist(body: ArtistCreateBody) {
  return db.spotifyArtist.create({
    data: body,
    include: {
      images: true,
      spotifyAlbum: {
        include: {
          images: true,
        },
      },
    },
  });
}

export async function updateArtist(id: string, body: ArtistUpdateBody) {
  return db.spotifyArtist.update({
    where: {
      id,
    },
    data: body,
    include: {
      images: true,
      spotifyAlbum: {
        include: {
          images: true,
        },
      },
    },
  });
}
