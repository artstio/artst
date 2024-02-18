import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { createMusicAlbumSD, createPersonSD } from "~/utils/structured-data";
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

export const loader = async ({
  context: { visitorId },
  params,
}: LoaderFunctionArgs) => {
  const { trackId } = params;
  if (!trackId) {
    throw redirect("/artist");
  }
  try {
    const track = await db.spotifyTrack.findUnique({
      where: { id: trackId },
      include: {
        spotifyArtists: true,
        spotifyAlbum: {
          include: {
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
            images: true,
            copyrights: true,
          },
        },
      },
    });

    const phClient = PostHogClient();

    if (track && typeof visitorId === "string" && visitorId.length > 0) {
      phClient.capture({
        distinctId: visitorId,
        event: "track_viewed",
        properties: {
          album: track.name,
        },
      });
    }

    return json({ track });
  } catch (error) {
    return json({ track: null }, { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${data?.track?.name} by ${data?.track?.spotifyAlbum.artists[0].name} | Artst`,
    },

    // { name: 'description', content: '...' },
    // { property: 'og:title', content: '...' },

    // you can now add SEO related <links>
    // { tagName: 'link', rel: 'canonical', href: '...' },

    // and <script type=ld+json>
    data?.track?.spotifyAlbum
      ? {
          "script:ld+json": createMusicAlbumSD(
            data.track.spotifyAlbum.name,
            createPersonSD(data.track.spotifyAlbum.artists[0])
          ),
        }
      : {},
  ];
};

export default function ArtistPage() {
  const { track } = useLoaderData<typeof loader>();
  if (!track) {
    return <div>Album not found</div>;
  }

  const sortedTracks = track;

  const albumImage = getLargestImage(track.spotifyAlbum.images);

  const platformLinks = [
    {
      name: "Spotify",
      url: track.spotifyUrl,
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
        <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:gap-12">
          {albumImage ? (
            <div className="flex items-start justify-center dark:bg-transparent">
              <img
                src={albumImage.url}
                alt={`${track.name} cover`}
                width={256}
                height={256}
                className="aspect-square w-full rounded-[4px] bg-neutral-950 shadow-md"
                loading="lazy"
                itemProp="image"
              />
            </div>
          ) : null}
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
                  {track.name}
                </Typography>
                <Typography
                  variant="h2"
                  aria-label="Album release date"
                  className="leading-tight"
                >
                  {getReleaseDate(track.spotifyAlbum.releaseDate)}
                </Typography>
                <Typography
                  variant="h2"
                  aria-label="Album duration"
                  className="leading-tight"
                >
                  {formatDuration(track.durationMs)}
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
          <TrackList tracks={track.spotifyAlbum.tracks} />
        </Section>

        <Typography size="sm">
          {getReleaseDate(track.spotifyAlbum.releaseDate)}
        </Typography>
      </PageContent>
    </>
  );
}
