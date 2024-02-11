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
import { VerticalCard } from "~/components/spotify/vertical-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
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
          take: 5,
          orderBy: {
            popularity: "desc",
          },
          include: {
            tracks: true,
            artists: true,
            images: true,
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
    { title: `${data?.artist?.name} | Artst` },

    // { name: 'description', content: '...' },
    // { property: 'og:title', content: '...' },

    // you can now add SEO related <links>
    // { tagName: 'link', rel: 'canonical', href: '...' },

    // and <script type=ld+json>
    data?.artist
      ? {
          "script:ld+json": createPersonSD(data.artist),
        }
      : {},
  ];
};

export default function ArtistPage() {
  const { artist } = useLoaderData<typeof loader>();
  console.log({ artist });
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

        <Section
          title="Discography"
          showAllProps={{
            to: `/artist/${artist.slug}/discography`,
            text: "See All",
          }}
        >
          <div className="overflow-x-auto snap-x">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 snap-x-mandatory overflow-x-auto snap-type-mandatory snap-mandatory snap-align-start">
              {artist.spotifyAlbum.length > 0 &&
                artist.spotifyAlbum.map((album, index) => (
                  <VerticalCard
                    key={`${album.id}-vertical-card`}
                    name={album.name}
                    subtexts={[
                      index === 0 && isRecentRelease(album.releaseDate)
                        ? "Latest Release"
                        : new Date(album.releaseDate).getFullYear().toString(),
                      getAlbumTypeText(album),
                    ]}
                    image={getLargestImage(album.images) || album.images[0]}
                    linkProps={{
                      to: `/album/${album.id}`,
                    }}
                  />
                ))}
            </div>
          </div>
        </Section>
      </PageContent>
    </div>
  );
}
