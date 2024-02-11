import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AlbumList, AlbumListProps } from "~/components/spotify/album-list";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const artists = await db.spotifyArtist.findMany({
    include: {
      images: true,
      spotifyAlbum: {
        include: {
          artists: true,
          tracks: true,
          images: true,
        },
      },
    },
  });

  return json({ artists });
};

export default function ArtistListPage() {
  const { artists } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Artist List</h1>

      {artists.map((artist) => (
        <ArtistCard
          key={artist.id}
          id={artist.id}
          name={artist.name}
          images={artist.images.map((image) => image.url)}
          albums={artist.spotifyAlbum.map((album) => ({
            ...album,
          }))}
        />
      ))}
    </div>
  );
}

function ArtistCard({
  id,
  name,
  images,
  albums,
}: {
  id: string;
  name: string;
  images: string[];
  albums?: AlbumListProps | null;
}) {
  return (
    <li key={id}>
      <h2>{id}</h2>
      <Avatar className="h-16 w-16">
        <AvatarImage
          src={images[0]}
          alt={`${name} Avatar`}
          width={320}
          height={320}
        />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>

      {albums && <AlbumList albums={albums} />}
    </li>
  );
}
