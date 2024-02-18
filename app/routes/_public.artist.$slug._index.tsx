import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { createPersonSD } from "~/utils/structured-data";
import { Navigation } from "~/components/navigation-test";
import { PageContent } from "~/components/page";
import { Section } from "~/components/section";
import { ArtistHeroHeader } from "~/components/spotify/artist/hero";
import { ListenPlatformLinks } from "~/components/spotify/platform-links";
import { VerticalCard } from "~/components/spotify/vertical-card";
import { getCachedArtist } from "~/models/spotify/artist";
import {
  getAlbumTypeText,
  getLargestImage,
  isRecentRelease,
} from "~/models/spotify/utils";
import { authenticator } from "~/services/auth/config.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { slug } = params;
  if (!slug) {
    throw redirect("/artist");
  }
  const user = await authenticator.isAuthenticated(request);
  try {
    const artist = await getCachedArtist({ slug });
    if (!artist) {
      throw new Error(
        JSON.stringify({ meesage: "Artist not found", status: 404 })
      );
    }

    return json({ user, artist });
  } catch (error: unknown) {
    const parsed = typeof error === "string" ? JSON.parse(error) : error;
    return json({ user, artist: null }, { status: parsed?.status || 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
  const { user, artist } = useLoaderData<typeof loader>();
  if (!artist || artist === null) {
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
      <Navigation user={user} />

      <ArtistHeroHeader artist={artist} />

      <PageContent className="mt-[calc(25vh_-_2rem)] space-y-6 md:mt-[calc(30vh_-_2rem)] md:space-y-12">
        <ListenPlatformLinks platforms={platformLinks} />

        <Section
          title="Discography"
          showAllProps={{
            to: `/artist/${artist.slug}/discography`,
            text: "See All",
          }}
        >
          <div className="snap-x overflow-x-auto">
            <div className="snap-x-mandatory snap-type-mandatory snap-align-start grid snap-mandatory grid-cols-2 gap-3 overflow-x-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {artist.spotifyAlbum.length > 0
                ? artist.spotifyAlbum.map((album, index) => (
                    <VerticalCard
                      key={`${album.id}-vertical-card`}
                      name={album.name}
                      subtexts={[
                        index === 0 && isRecentRelease(album.releaseDate)
                          ? "Latest Release"
                          : new Date(album.releaseDate)
                              .getFullYear()
                              .toString(),
                        getAlbumTypeText(album),
                      ]}
                      image={getLargestImage(album.images) || album.images[0]}
                      linkProps={{
                        to: `/album/${album.id}`,
                      }}
                    />
                  ))
                : null}
            </div>
          </div>
        </Section>
      </PageContent>
    </div>
  );
}
