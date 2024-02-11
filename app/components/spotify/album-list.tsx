import { LinksFunction } from "@remix-run/node";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Typography } from "~/components/ui/typography";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { DiscIcon } from "@radix-ui/react-icons";
import {
  AlbumAggregateProps,
  type AlbumAggregateData,
} from "~/models/spotify/album";
import { MaybeJsonified } from "~/utils/types";
import { formatDuration, isEp } from "~/models/spotify/utils";
import { Section } from "../section";
import { TrackAggregateProps } from "~/models/spotify/track";
import { TrackList } from "./track-list";
import { Link } from "@remix-run/react";
import { Separator } from "../ui/separator";

// type ArtistAlbumCardProps = React.ComponentProps<typeof Card>;

export type AlbumCardProps = MaybeJsonified<AlbumAggregateData> & {
  // id: string;
  // name: string;
  // slug: string;
  // trackCount: number;
  // // artwork: string;
  // releaseDate: Date | string;
  // // numberOfTracks: string;
  // images?: ImageProps[];
  className?: string;
};

export type AlbumListProps = AlbumCardProps[];

type ImageProps = {
  id: string;
  url: string;
  spotifyArtistId?: string;
  width: number;
  height: number;
};

function getSmallestImage(images?: ImageProps[]) {
  if (!images) {
    return;
  }
  return images.reduce((smallest, current) => {
    if (current.width < smallest.width) {
      return current;
    }
    return smallest;
  });
}

function getLargestImage(images?: ImageProps[]) {
  if (!images) {
    return;
  }
  return images.reduce((largest, current) => {
    if (current.width > largest.width) {
      return current;
    }
    return largest;
  });
}

const IMG_SIZES = [640, 300, 64];

// export function ArtistAlbumCardMDOT({
// 	id,
// 	name,
// 	trackCount,
// 	className,
// 	images,
// 	releaseDate,
// 	...props
// }: ArtistAlbumCardComponentProps) {
// 	const isRecentRelease = new Date(releaseDate) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days
// 	const largestImage = getLargestImage(images);

// 	return (
// 		<>
// 			<Card className={cn('w-60', className)} {...props}>
// 				<CardHeader>
// 					{largestImage && (
// 						<img
// 							src={largestImage.url}
// 							width={largestImage.width}
// 							height={largestImage.height}
// 							alt={`${name} Album Cover`}
// 							className="object-cover h-full w-full rounded-t-md bg-neutral-900"
// 						/>
// 					)}
// 				</CardHeader>
// 				<CardContent className="grid gap-1 mt-2">
// 					<div className="flex flex-col">
// 						<Typography variant="h3">{name}</Typography>
// 					</div>

// 					<span className="flex items-center gap-1">
// 						<DiscIcon className="h-4 w-4" />
// 						<Typography variant="span">{`${trackCount} tracks`}</Typography>
// 					</span>

// 					<div className="flex">{isRecentRelease && <Badge variant="outline">New</Badge>}</div>
// 				</CardContent>
// 			</Card>
// 		</>
// 	);
// }

export function ArtistAlbumCard(props: AlbumCardProps) {
  const {
    id,
    name,
    slug,
    trackCount,
    images,
    releaseDate,
    artists,
    tracks,
    popularity,
    spotifyUrl,
    albumType: type,
    ean,
    isPlayable,
    isrc,
    upc,
    label,
    apiHref,
    releaseDatePrecision,
    className,
    ...rest
  } = props;
  const isRecentRelease =
    new Date(releaseDate) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days
  const largestImage = getLargestImage(images);

  const isAlbum = type === "album";
  const albumTypeText = isAlbum ? "Album" : isEp(trackCount) ? "EP" : "Single";

  return (
    <Card className={cn("", className)} {...rest}>
      <CardContent className="grid grid-cols-[auto,1fr] gap-4 md:gap-8">
        <div>
          {largestImage && (
            <img
              src={largestImage.url}
              width={largestImage.width}
              height={largestImage.height}
              alt={`${name} Album Cover`}
              className="object-cover h-40 w-40 bg-neutral-900"
            />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex flex-col">
            <Typography weight="bold">{name}</Typography>

            <Typography variant="muted" weight="semi">
              {albumTypeText}
            </Typography>
          </div>

          <div className="space-y-1">
            <Typography variant="small">{id}</Typography>
            <AlbumBadges {...props} />
            <TracksCount count={trackCount} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlbumBadges(album: AlbumCardProps) {
  const isRecentRelease =
    new Date(album.releaseDate) >
    new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days

  return (
    <div className="flex gap-2">
      {isRecentRelease && <Badge variant="outline">New</Badge>}

      <PopularityBadge popularity={album.popularity} />
    </div>
  );
}

function TracksCount({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1">
      {/* <DiscIcon className="h-3 w-3" /> */}
      <Typography variant="muted" size="sm">{`${count} tracks`}</Typography>
    </span>
  );
}

export function AlbumList({ albums }: { albums: AlbumListProps }) {
  return (
    <div className="space-y-6 md:space-y-8">
      {albums.map((album, index) => (
        <div className="space-y-4 md:space-y-6">
          <AlbumTrackList key={album.id} album={album} />

          {index < albums.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}

function PopularityBadge({ popularity = 0 }: { popularity?: number | null }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline">Popularity: {popularity}</Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px]">
          Popularity is a value that spotify uses to generate playlists and
          recommendations.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AlbumTrackListItem({ track }: { track: TrackAggregateProps }) {
  return (
    <div className="flex p-3 items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <Typography variant="muted" size="sm">
            {track.trackNumber}
          </Typography>
        </div>
        <Typography variant="h3">{track.name}</Typography>
      </div>
      <div>
        <Typography variant="muted" size="sm">
          {formatDuration(track.durationMs)}
        </Typography>
      </div>
    </div>
  );
}

export function AlbumTrackList({ album }: { album: AlbumAggregateProps }) {
  const image = getLargestImage(album.images);
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {image && (
            <Link to={`/album/${album.id}`}>
              <img
                src={image.url}
                width={40}
                height={40}
                alt={`${album.name} Album Cover`}
                className="object-cover h-24 w-24 bg-neutral-900"
              />
            </Link>
          )}
          <Link to={`/album/${album.id}`} className="flex flex-col gap-2">
            <Typography variant="h2" className="font-bold">
              {album.name}
            </Typography>
            <Typography
              as="span"
              variant="muted"
              size="sm"
              aria-label="Release year"
            >
              {new Date(album.releaseDate).getFullYear()}
            </Typography>
          </Link>
        </div>
        <TrackList
          tracks={album.tracks.sort((a, b) => a.trackNumber - b.trackNumber)}
        />
      </div>
    </>
  );
}
