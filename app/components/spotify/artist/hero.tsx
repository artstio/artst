import { Link } from "@remix-run/react";
import { useSmartcrop } from "use-smartcrop";

import { useScreenSize } from "~/utils/hooks";
import type { MaybeJsonified } from "~/utils/types";
import { PageContent } from "~/components/page";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";
import type { ArtistAggregateData } from "~/models/spotify/artist";
import { getLargestImage, getSmallestImage } from "~/models/spotify/utils";
import { ListenPlatformButton } from "../listen-platform-button";

const heroHeight =
  "clamp(250px,250px + (100vw - 420px - 0px - 600px)/424*90,340px)";

export function ArtistHeroHeader({
  artist,
}: {
  artist: MaybeJsonified<ArtistAggregateData>;
}) {
  const heroImage = getLargestImage(artist.images);
  const smallImage = getSmallestImage(artist.images);
  const { width, height } = useScreenSize();
  const [cropped, error] = useSmartcrop(
    { src: (heroImage || smallImage)?.url || "" },
    { width: width, height: height / 3, minScale: 1.0 }
  );

  if (error) {
    console.error(error);
  }

  return (
    <section className="absolute top-0 -z-20 w-full">
      <div className="relative min-h-[30vh] w-full py-12 md:min-h-[35vh] md:py-16 xl:py-20">
        {heroImage && cropped ? (
          <img
            src={cropped}
            alt={`${artist.name} cover`}
            width={200}
            height={400}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            itemProp="image"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-start justify-end">
          <PageContent>
            <Typography variant="h1" className="text-6xl text-white">
              {artist.name}
            </Typography>
          </PageContent>
        </div>
      </div>
    </section>
  );
}
