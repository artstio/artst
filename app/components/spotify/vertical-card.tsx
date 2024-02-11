import { ImageProps } from "~/models/spotify/image/types";
import { Typography } from "../ui/typography";
import { Link } from "@remix-run/react";

type LinkProps = {
  to: string;
};

type VerticalCardProps = {
  image: ImageProps;
  name: string;
  subtexts?: string[];
  // artists?: string[];
  linkProps: LinkProps;
};

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
        <div className="group flex-1 p-5 bg-neutral-800/30 hover:bg-neutral-800/50 rounded-md space-y-5 transition-all">
          <div className="">
            <img
              src={image.url}
              alt={name}
              // width={width}
              // height={image.height}
              className="rounded-sm group-hover:shadow-md shadow-sm transition-all aspect-square snap-center w-full h-full"
              loading="lazy"
            />
          </div>

          {/* <AlbumLink> */}
          <div className="max-w-full">
            <div className={`flex flex-col gap-0.5`}>
              <Typography
                size="md"
                weight="bold"
                className="leading-snug truncate"
                itemProp="name"
              >
                {name}
              </Typography>
              {subtexts && (
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
                        {index < subtexts.length - 1 && (
                          <span className="text-neutral-500 mx-1 leading-tight">
                            •
                          </span>
                        )}
                      </>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* </AlbumLink> */}
        </div>
      </div>
    </AlbumLink>
  );
};
