import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Navigation } from "~/components/navigation-test";
import { PageContent, PageHeader } from "~/components/page";
import { Section } from "~/components/section";
import { AlbumList } from "~/components/spotify/album-list";
import { ArtistHeroHeader } from "~/components/spotify/artist/hero";
import { ListenPlatformLinks } from "~/components/spotify/platform-links";
import { TrackList } from "~/components/spotify/track-list";
import { VerticalCard } from "~/components/spotify/vertical-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import {
  AlbumAggregateData,
  AlbumAggregateProps,
} from "~/models/spotify/album";
import {
  getAlbumTypeText,
  getLargestImage,
  isEp,
  isRecentRelease,
} from "~/models/spotify/utils";
import { db } from "~/utils/db.server";
import { createPersonSD } from "~/utils/structured-data";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;
  if (!slug) {
    throw redirect("/artist");
  }
  try {
    const artist = await db.spotifyArtist.findUnique({
      where: { slug },
      include: {
        images: true,
        spotifyAlbum: {
          take: 20,
          orderBy: {
            releaseDate: "desc",
          },
          include: {
            images: true,
            copyrights: true,
            tracks: {
              include: {
                spotifyArtists: true,
              },
            },
            artists: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    return json({ artist });
  } catch (error) {
    return json({ artist: null }, { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  return [
    { title: `${data?.artist?.name} Discography | Artst` },
    {
      name: "description",
      content: `Discography and albums by ${data?.artist?.name}`,
    },

    {
      name: "og:title",
      content: `${data?.artist?.name} Discography | Artst`,
    },
    {
      name: "og:description",
      content: `Discography and albums by ${data?.artist?.name}`,
    },

    // data?.artist
    // 	? {
    // 			'script:ld+json': createPersonSD(data.artist),
    // 	  }
    // 	: {},
  ];
};

export default function ArtistDiscographyPage() {
  const { artist } = useLoaderData<typeof loader>();
  if (!artist) {
    return <div>Artist not found</div>;
  }

  const platformLinks = [
    {
      name: "Spotify",
      url: artist.spotifyUrl,
    },
    // {
    // 	name: 'Apple Music',
    // 	url: artist.appleMusicUrl,
    // },
    // {
    // 	name: 'YouTube Music',
    // 	url: artist.youtubeMusicUrl,
    // },
    // {
    // 	name: 'Amazon Music',
    // 	url: artist.amazonMusicUrl,
    // },
  ];

  return (
    <div>
      <Navigation user={null} />

      <ArtistHeroHeader artist={artist} />

      <PageContent className="space-y-6 md:space-y-12 mt-[calc(25vh_-_2rem)] md:mt-[calc(30vh_-_2rem)]">
        <ListenPlatformLinks platforms={platformLinks} />

        <Section title="Discography">
          <AlbumList albums={artist.spotifyAlbum} />
        </Section>
      </PageContent>
    </div>
  );
}
