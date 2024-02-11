import { Link } from "@remix-run/react";

import { PageContent } from "~/components/page";
import { MaxWidthWrapper } from "~/components/page/max-width-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import { AlbumAggregateData } from "~/models/spotify/album";
import {
  getAlbumTypeText,
  getLargestImage,
  getReleaseDate,
  getSmallestImage,
} from "~/models/spotify/utils";
import { MaybeJsonified } from "~/utils/types";

import { ListenPlatformLinks } from "../platform-links";

export function AlbumHeroHeader({
  album,
}: {
  album: MaybeJsonified<AlbumAggregateData>;
}) {
  const heroImage = getLargestImage(album.images);
  if (!album) {
    return null;
  }

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
      <div>
        <>
          <div className="flex flex-col md:flex-row gap-6">
            {heroImage ? <div>
                <img
                  src={heroImage.url}
                  alt={`${album.name} cover`}
                  width={256}
                  height={256}
                  className="w-64 h-64 bg-neutral-950"
                  loading="lazy"
                  itemProp="image"
                />
              </div> : null}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Typography variant="muted" size="sm">
                    {getAlbumTypeText(album)}
                  </Typography>
                </div>
                <Typography variant="h1" className="text-6xl">
                  {album.name}
                </Typography>
                <div className="flex flex-col gap-2">
                  {album.artists.length > 0 ? <div className="mt-3">
                      {album.artists.map((artist) => (
                        <ArtistLink key={artist.slug} artist={artist} />
                      ))}
                    </div> : null}
                  <div className="flex items-center gap-2">
                    <Typography variant="muted" size="sm">
                      {new Date(album.releaseDate).getFullYear().toString()}
                    </Typography>

                    {/* separator dot */}
                    <span className="w-1 h-1 bg-muted-foreground rounded-full" />

                    <Typography variant="muted" size="sm">
                      {album.trackCount} tracks,{" "}
                      {getAlbumDuration(
                        album.tracks.reduce(
                          (acc, track) => acc + +track.durationMs,
                          0
                        )
                      )}
                    </Typography>
                  </div>
                </div>
              </div>
              <ListenPlatformLinks platforms={platformLinks} />
            </div>
          </div>
        </>

        {/* <p class="text-xl text-white mt-4">This is a sample text</p> */}

        {/* <div className="static px-4 space-y-4 z-20">
					<div className="flex flex-col items-start space-y-2 text-left">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl/none text-white">
								{artist.name}
							</h1>
						</div>
					</div>
				</div> */}

        {/* <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 bg-blend-lighten z-10" /> */}
        {/* <div
					className="absolute inset-0 bg-cover bg-center "

				/> */}
      </div>

      {/* <h1>{artist.name}</h1> */}
      {/* {heroImage && (
				<img
					src={heroImage.url}
					alt={`${artist.name} Avatar`}
					width={heroImage.width}
					height={heroImage.height}
				/>
			)} */}
    </>
  );
}

function ArtistLink({
  artist,
}: {
  artist: {
    slug: string;
    images: { url: string }[];
    name: string;
  };
}) {
  return (
    <Link
      to={`/artist/${artist.slug}`}
      className="flex items-center gap-2 hover:underline"
    >
      <Avatar className="w-5 h-5">
        {artist.images?.[0] ? <AvatarImage src={artist.images[0].url} alt={artist.name} /> : null}
        <AvatarFallback>{artist.name[0]}</AvatarFallback>
      </Avatar>
      <Typography variant="p" weight="medium">
        {artist.name}
      </Typography>
    </Link>
  );
}

function getAlbumDuration(durationMs: number) {
  // convert ms to hours, mins and seconds
  const ms = new Date(durationMs).getTime();
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor(((ms % 360000) % 60000) / 1000);

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`;
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  }

  if (seconds > 0) {
    return `${seconds} sec`;
  }
}
