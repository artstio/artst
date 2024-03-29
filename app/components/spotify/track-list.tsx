import { Link } from "@remix-run/react";

import type { TrackAggregateData } from "~/models/spotify/track";
import { formatDuration } from "~/models/spotify/utils";
import { Typography } from "../ui/typography";

interface TrackListProps {
  tracks: any[];
}

export function TrackListItem({ track }: { track: TrackAggregateData }) {
  return (
    <div className="flex items-center justify-between rounded-sm px-3 py-2 transition-all hover:bg-neutral-200/20 hover:dark:bg-neutral-800/20">
      <div className="flex items-center gap-4">
        <div>
          <Typography variant="muted" size="sm" className="min-w-3 text-center">
            {track.trackNumber}
          </Typography>
        </div>

        <div className="flex flex-col gap-1">
          <Link to={`/track/${track.id}`}>
            <Typography variant="p" className="font-semibold">
              {track.name}
            </Typography>
          </Link>
          {track.spotifyArtists.length > 0 ? (
            <div className="flex items-center gap-1">
              {track.spotifyArtists.map((artist) => (
                <Link key={artist.id} to={`/artist/${artist.slug}`}>
                  <Typography
                    variant="muted"
                    size="sm"
                    className="transition-all hover:text-primary hover:underline"
                  >
                    {artist.name}
                  </Typography>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Typography variant="muted" size="sm">
        {formatDuration(track.durationMs)}
      </Typography>
    </div>
  );
}

export function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="-space-y-1">
      {tracks.map((track) => (
        <TrackListItem key={`track-list-item-${track.id}`} track={track} />
      ))}
    </div>
  );
}
