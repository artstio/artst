import { Link } from "@remix-run/react";

import type { ImageProps } from "~/models/spotify/image/types";
import { Typography } from "../ui/typography";

interface LinkProps {
  to: string;
}

interface VerticalCardProps {
  image: ImageProps;
  name: string;
  subtexts?: string[];
  // artists?: string[];
  linkProps: LinkProps;
}

export const VerticalCard = ({
  name,
  subtexts,
  image,
  linkProps,
}: VerticalCardProps) => {
  const width = 160;
  const AlbumLink = ({ children }: { children: React.ReactNode }) => (
    <Link to={linkProps.to}>{children}</Link>
  );
  return (
    <AlbumLink>
      <div className="" itemType="http://schema.org/MusicAlbum">
        <div className="group flex-1 space-y-4 rounded-md bg-card p-4 transition-all hover:bg-card-hover md:p-5">
          <div className="">
            <img
              src={image.url}
              alt={name}
              // width={width}
              // height={image.height}
              className="aspect-square h-full w-full snap-center rounded-sm shadow-sm transition-all group-hover:shadow-md"
              loading="lazy"
            />
          </div>

          {/* <AlbumLink> */}
          <div className="max-w-full">
            <div className={`flex flex-col gap-0.5`}>
              <Typography
                size="md"
                weight="bold"
                className="truncate leading-snug"
                itemProp="name"
              >
                {name}
              </Typography>
              {subtexts ? (
                <div className="flex items-center gap-0.5">
                  {subtexts.map((subtext, index) => (
                    <div key={index} className="flex items-center">
                      <Typography
                        variant="muted"
                        size="sm"
                        className="leading-snug"
                      >
                        {subtext}
                      </Typography>

                      {/* separator dot */}
                      <>
                        {index < subtexts.length - 1 ? (
                          <span className="mx-1 leading-tight text-neutral-500">
                            •
                          </span>
                        ) : null}
                      </>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {/* </AlbumLink> */}
        </div>
      </div>
    </AlbumLink>
  );
};
