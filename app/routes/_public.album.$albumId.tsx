import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Navigation } from "~/components/navigation-test";
import { PageContent } from "~/components/page";
import { Section } from "~/components/section";
import { ListenPlatformLinks } from "~/components/spotify/platform-links";
import { TrackList } from "~/components/spotify/track-list";
import { Typography } from "~/components/ui/typography";
import {
  formatDuration,
  getLargestImage,
  getReleaseDate,
} from "~/models/spotify/utils";
import PostHogClient from "~/services/posthog";
import { db } from "~/utils/db.server";
import { createMusicAlbumSD, createPersonSD } from "~/utils/structured-data";

export const loader = async ({
  context: { visitorId },
  params,
}: LoaderFunctionArgs) => {
  const { albumId } = params;
  if (!albumId) {
    throw redirect("/artist");
  }
  try {
    const album = await db.spotifyAlbum.findUnique({
      where: { id: albumId },
      include: {
        images: true,
        tracks: {
          include: {
            spotifyArtists: {
              include: {
                images: true,
              },
            },
          },
        },
        artists: {
          include: {
            images: true,
          },
        },
        copyrights: true,
      },
    });

    const phClient = PostHogClient();
    console.log({ visitorId });
    if (album && typeof visitorId === "string" && visitorId.length > 0) {
      phClient.capture({
        distinctId: visitorId,
        event: "album_viewed",
        properties: {
          album: album.name,
        },
      });
    }

    return json({ album });
  } catch (error) {
    return json({ album: null }, { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${data?.album?.name} by ${data?.album?.artists[0].name} | Artst`,
    },

    // { name: 'description', content: '...' },
    // { property: 'og:title', content: '...' },

    // you can now add SEO related <links>
    // { tagName: 'link', rel: 'canonical', href: '...' },

    // and <script type=ld+json>
    data?.album
      ? {
          "script:ld+json": createMusicAlbumSD(
            data.album.name,
            createPersonSD(data.album.artists[0])
          ),
        }
      : {},
  ];
};

export default function ArtistPage() {
  const { album } = useLoaderData<typeof loader>();
  if (!album) {
    return <div>Album not found</div>;
  }

  const sortedTracks = album.tracks.sort(
    (a, b) => a.trackNumber - b.trackNumber
  );

  const albumImage = getLargestImage(album.images);

  const platformLinks = [
    {
      name: "Spotify",
      url: album.spotifyUrl,
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
    <>
      <Navigation user={null} />
      {/* <PageHeader
				title={artist.name}
				subtitle={`This is the artist page for ${artist.name}.`}
				description={`This is the artist page for ${artist.name}.`}
			/> */}

      {/* {album.artists && <ArtistHeroHeader artist={album.artists[0]} />} */}

      <PageContent className="space-y-12">
        <div className="grid sm:grid-cols-2 gap-4 md:gap-8 lg:gap-12">
          {albumImage ? <div className="dark:bg-transparent flex items-start justify-center">
              <img
                src={albumImage.url}
                alt={`${album.name} cover`}
                width={256}
                height={256}
                className="aspect-square w-full bg-neutral-950 rounded-[4px] shadow-md"
                loading="lazy"
                itemProp="image"
              />
            </div> : null}
          <div className="space-y-4 md:space-y-8 lg:space-y-12">
            <div>
              {/* <div className="flex items-center gap-2">
							<Typography variant="muted" size="sm">
								{getAlbumTypeText(album)}
							</Typography>
						</div> */}
              <div className="space-y-1">
                <Typography
                  variant="h2"
                  aria-label="Album name"
                  className="leading-tight"
                >
                  {album.name}
                </Typography>
                <Typography
                  variant="h2"
                  aria-label="Album release date"
                  className="leading-tight"
                >
                  {getReleaseDate(album.releaseDate)}
                </Typography>
                <Typography
                  variant="h2"
                  aria-label="Album duration"
                  className="leading-tight"
                >
                  {formatDuration(
                    album.tracks.reduce(
                      (total, curr) => total + curr.durationMs,
                      0
                    )
                  )}
                </Typography>
              </div>

              <ListenPlatformLinks platforms={platformLinks} />
            </div>

            {/* <div className="flex flex-col gap-0.5">
							{album.tracks.map(track => (
								<div key={track.id}>
									<Link to={`/track/${track.id}`} className="hover:underline" itemProp="track">
										<Typography variant="h4" className="leading-tight">
											{track.name}
										</Typography>
									</Link>
								</div>
							))}
						</div> */}
          </div>
        </div>

        <Section title="Tracks">
          <TrackList tracks={sortedTracks} />
        </Section>

        <Typography size="sm">{getReleaseDate(album.releaseDate)}</Typography>
      </PageContent>
    </>
  );
}
