import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import type { AlbumListProps } from "~/components/spotify/album-list";
import { AlbumList } from "~/components/spotify/album-list";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Typography } from "~/components/ui/typography";
import { getLargestImage } from "~/models/spotify/utils";
import { authenticator } from "~/services/auth/config.server";

const PAGINATION_KEYS = {
  take: "take",
  skip: "skip",
  cursor: "next",
};

function getPaginationParams(url: URL) {
  const searchParams = url.searchParams;
  const take = Number(searchParams.get(PAGINATION_KEYS.take)) || 10;
  const skip = Number(searchParams.get(PAGINATION_KEYS.skip)) || 0;
  const cursor = searchParams.get(PAGINATION_KEYS.cursor) || undefined;

  return { take, skip, cursor };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const paginationParams = getPaginationParams(new URL(request.url));

  const cursor = paginationParams.cursor;

  const [artists] = await Promise.all([
    db.spotifyArtist.findMany({
      include: {
        images: true,
        spotifyAlbum: {
          include: {
            artists: {
              include: {
                images: true,
              },
            },
            tracks: {
              include: {
                spotifyArtists: true,
              },
            },
            images: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: paginationParams.take,
      skip: 0,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    }),
  ]);

  const nextCursor =
    artists.length && cursor !== artists[artists.length - 1].id
      ? artists[artists.length - 1].id
      : undefined;

  return json({ artists, nextCursor });
};

export default function ArtistListPage() {
  const { artists, nextCursor } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Artist List</h1>

      <div className="grid grid-cols-6">
        {artists.map((artist) => {
          const image = getLargestImage(artist.images);
          console.log({ image });
          return (
            <div
              key={artist.id}
              id={artist.id}
              className="relative flex h-64 w-full flex-col justify-end overflow-hidden px-8 pb-8 pt-40 md:h-80"
            >
              <img
                src={image?.url || "https://via.placeholder.com/300"}
                alt={artist.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900/40"></div>
              <Link to={`/artist/${artist.slug}`} className="z-10 mt-3">
                <Typography variant="h3">{artist.name}</Typography>
              </Link>
              {/* <div className="absolute inset-0 flex items-center justify-center">
              </div> */}
            </div>
          );
        })}
      </div>

      {nextCursor && (
        <Link to={`?${PAGINATION_KEYS.cursor}=${nextCursor}`}>Next</Link>
      )}
    </div>
  );
}
