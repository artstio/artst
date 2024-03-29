import { Prisma } from "@prisma/client";
import type { Album, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";

import { db } from "~/utils/db.server";
import { spotify } from "~/services/spotify";
import { createArtistInput } from "../artist";
import { createSimplifiedTrackInput } from "../track";
import { createAlbumInput, updateAlbumInput } from "./transformers";
import type { AlbumCreateBody } from "./types";

export async function getAlbum(id: string) {
  return spotify.albums.get(id);
}

export async function getAlbumFromDb(id: string) {
  try {
    return await db.spotifyAlbum.findFirst({
      where: {
        id,
      },
      include: {
        artists: true,
        images: true,
        tracks: { include: { spotifyArtists: true } },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return null;
  }
}

export async function searchArtist(query: string) {
  return spotify.search(query, ["artist"]);
}

export async function createAlbum(body: AlbumCreateBody) {
  try {
    return await db.spotifyAlbum.create({
      data: body,
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email"
        );
      }

      console.log(e.code); // e.g. P2002
    }
    throw e;
  }
}

export async function getArtistAlbums(artistId: string) {
  return spotify.artists.albums(artistId);
}

export async function getArtistAlbumsFromDb(artistId: string) {
  return db.spotifyAlbum.findMany({
    where: {
      artists: {
        some: {
          id: artistId,
        },
      },
    },
  });
}

export async function getCachedAlbum(id: string) {
  const album = await getAlbumFromDb(id);
  // if (album) {
  // 	return album;
  // }

  const connectArtists = !album?.artists || !album.artists.length;
  const connectTrackArtists = album?.tracks?.some(
    (track) => !track.spotifyArtists || !track.spotifyArtists.length
  );

  if (album && !connectArtists && !connectTrackArtists) {
    return album;
  }
  const spotifyAlbum = await getAlbum(id);
  if (connectArtists || connectTrackArtists) {
    return db.$transaction(updateSpotifyAlbum(spotifyAlbum));
  }

  if (spotifyAlbum) {
    return db.$transaction(createSpotifyAlbum(spotifyAlbum));
  }

  return null;
}

export async function createArtistAlbums(
  artistId: string,
  albums: SimplifiedAlbum[]
) {
  try {
    return db.$transaction((tx) =>
      Promise.all(albums.map((album) => createSpotifyAlbum(album)(tx)))
    );
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function getCachedArtistAlbums(artistId: string) {
  const [spotifyAlbums, albums] = await Promise.all([
    getArtistAlbums(artistId),
    db.spotifyAlbum.findMany({
      where: {
        artists: {
          some: {
            id: artistId,
          },
        },
      },
      include: {
        artists: true,
        images: true,
        tracks: true,
      },
    }),
  ]);
  const shouldUpdate =
    spotifyAlbums.items.length !== albums.length ||
    !albums.every((album) => album.artists && album.artists?.length > 0);

  if (!shouldUpdate) {
    return albums;
  }

  if (spotifyAlbums) {
    return createArtistAlbums(artistId, spotifyAlbums.items);
  }

  return null;
}

const createSpotifyAlbum =
  (album: Album | SimplifiedAlbum) => async (tx: Prisma.TransactionClient) => {
    const spotifyAlbum = await spotify.albums.get(album.id);
    const existingAlbum = await tx.spotifyAlbum.findFirst({
      where: {
        id: album.id,
      },
    });
    if (existingAlbum) {
      // TODO: update album
      return existingAlbum;
    }

    const [createdAlbum, { items: spotifyTracks }] = await Promise.all([
      tx.spotifyAlbum.upsert({
        where: {
          id: album.id,
        },
        update: updateAlbumInput(spotifyAlbum),
        create: createAlbumInput(spotifyAlbum),
      }),
      spotify.albums.tracks(album.id),
    ]);

    if (spotifyTracks.length) {
      console.log(`found ${spotifyTracks.length} tracks for album ${album.id}`);
      console.log({ createdAlbum, spotifyTracks });
      const albumTracks = await tx.spotifyTrack.createMany({
        skipDuplicates: true,
        data: spotifyTracks.map((track) => ({
          ...createSimplifiedTrackInput(track),
          spotifyAlbumId: album.id,
        })),
      });

      if (albumTracks.count) {
        await Promise.all(
          spotifyTracks.map((track) => {
            return track.artists.map((artist) => {
              return tx.spotifyTrack.update({
                where: {
                  id: track.id,
                },
                data: {
                  spotifyArtists: {
                    connectOrCreate: track.artists.map((artist) => ({
                      where: {
                        id: artist.id,
                      },
                      create: {
                        ...createArtistInput({
                          ...artist,
                          genres: [],
                          followers: { total: 0, href: "" },
                          images: [],
                          popularity: 0,
                        }),
                      },
                    })),
                  },
                },
              });
            });
          })
        );

        console.log(
          `created ${albumTracks.count} tracks for album ${album.id}`
        );
      }
    }

    return createdAlbum;
  };

const updateSpotifyAlbum =
  (album: Album | SimplifiedAlbum) => async (tx: Prisma.TransactionClient) => {
    console.log("updating album", album.id);
    const spotifyAlbum = await spotify.albums.get(album.id);
    const existingAlbum = await tx.spotifyAlbum.findFirst({
      where: {
        id: album.id,
      },
      include: {
        artists: true,
        tracks: {
          include: {
            spotifyArtists: true,
          },
        },
      },
    });
    if (!existingAlbum) {
      return createSpotifyAlbum(spotifyAlbum)(tx);
    }

    const artistsToConnect = spotifyAlbum.artists.filter((artist) => {
      return !existingAlbum.artists.some((a) => a.id === artist.id);
    });
    const tracksToConnect = spotifyAlbum.tracks.items.filter((track) => {
      return !existingAlbum.tracks.some((a) =>
        track.artists.some((artist) =>
          a.spotifyArtists.some((b) => b.id === artist.id)
        )
      );
    });
    if (artistsToConnect.length) {
      return await tx.spotifyAlbum.update({
        where: {
          id: album.id,
        },
        data: {
          artists: {
            connect: artistsToConnect.map((artist) => ({
              id: artist.id,
            })),
          },
        },
      });
    }

    if (tracksToConnect.length) {
      return Promise.all(
        tracksToConnect.map((track) => {
          return tx.spotifyTrack.upsert({
            where: {
              id: track.id,
            },
            update: {
              spotifyAlbumId: album.id,
              spotifyArtists: {
                connectOrCreate: track.artists.map((artist) => ({
                  where: {
                    id: artist.id,
                  },
                  create: {
                    ...createArtistInput({
                      ...artist,
                      genres: [],
                      followers: { total: 0, href: "" },
                      images: [],
                      popularity: 0,
                    }),
                  },
                })),
              },
            },

            create: {
              ...createSimplifiedTrackInput(track),
              spotifyAlbum: {
                connect: {
                  id: album.id,
                },
              },
              spotifyArtists: {
                connectOrCreate: track.artists.map((artist) => ({
                  where: {
                    id: artist.id,
                  },
                  create: {
                    ...createArtistInput({
                      ...artist,
                      genres: [],
                      followers: { total: 0, href: "" },
                      images: [],
                      popularity: 0,
                    }),
                  },
                })),
              },
            },
          });
        })
      );
    }

    return null;
  };
