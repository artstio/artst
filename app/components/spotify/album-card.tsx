import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { DiscIcon } from "@radix-ui/react-icons";
import { LinksFunction } from "@remix-run/node";
import { Typography } from "../ui/typography";
import { Badge } from "../ui/badge";
import { type AlbumAggregateData } from "~/models/spotify/album";
import { MaybeJsonified } from "~/utils/types";
import { getLargestImage, isRecentRelease } from "~/models/spotify/utils";

type ArtistAlbumCardProps = React.ComponentProps<typeof Card>;

export type ArtistAlbumCardComponentProps = ArtistAlbumCardProps &
  MaybeJsonified<AlbumAggregateData> & {
    // id: string;
    // name: string;
    // slug: string;
    // trackCount: number;
    // // artwork: string;
    // releaseDate: Date | string;
    // // numberOfTracks: string;
    // images?: ImageProps[];
  };

const IMG_SIZES = [640, 300, 64];

export function ArtistAlbumCardMDOT({
  id,
  name,
  trackCount,
  className,
  images,
  releaseDate,
  ...props
}: ArtistAlbumCardComponentProps) {
  const largestImage = getLargestImage(images);

  return (
    <>
      <Card className={cn("w-60", className)} {...props}>
        <CardHeader>
          {largestImage && (
            <img
              src={largestImage.url}
              width={largestImage.width}
              height={largestImage.height}
              alt={`${name} Album Cover`}
              className="object-cover h-full w-full rounded-t-md bg-neutral-900"
            />
          )}
        </CardHeader>
        <CardContent className="grid gap-1 mt-2">
          <div className="flex flex-col">
            <Typography variant="h3">{name}</Typography>
          </div>

          <span className="flex items-center gap-1">
            <DiscIcon className="h-4 w-4" />
            <Typography variant="span">{`${trackCount} tracks`}</Typography>
          </span>

          <div className="flex">
            {isRecentRelease(releaseDate) && (
              <Badge variant="outline">New</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function ArtistAlbumCard({
  id,
  name,
  slug,
  trackCount,
  images,
  releaseDate,
  artists,
  apiHref,
  tracks,
  albumType,
  popularity,
  spotifyUrl,
  type,
  ean,
  isPlayable,
  isrc,
  upc,
  label,
  releaseDatePrecision,
  className,
  ...props
}: ArtistAlbumCardComponentProps) {
  const isRecentRelease =
    new Date(releaseDate) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days
  const largestImage = getLargestImage(images);

  const albumTypeString =
    albumType === "album"
      ? "Album"
      : albumType === "single"
      ? "Single"
      : "Compilation";

  return (
    <>
      <Card {...props} className={cn("", className)}>
        <CardContent className="grid grid-cols-[auto,1fr] gap-4">
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
          <div>
            <div className="flex flex-col">
              <Typography variant="h3">{name}</Typography>
            </div>

            <span className="flex items-center gap-1">
              <DiscIcon className="h-4 w-4" />
              <Typography variant="span">{`${trackCount} tracks`}</Typography>
            </span>

            <div className="flex">
              {isRecentRelease && <Badge variant="outline">New</Badge>}
              {popularity && (
                <Badge variant="outline">Popularity: {popularity}</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
