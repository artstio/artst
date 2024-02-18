import { useMemo } from "react";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Icons } from "~/components/shared/icons";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "../ui/button";

export const ListenPlatformButton = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  const Icon = useMemo(() => {
    switch (name) {
      case "Spotify":
        return Icons.SpotifyFill;
      // case 'Apple Music':
      // 	return Icons.AppleMusicFill;
      // case 'YouTube':
      // 	return Icons.YouTubeFill;
      default:
        return Icons.SpotifyFill;
    }
  }, [name]);

  const { t } = useTranslation("common");

  return (
    <Link
      to={url}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-2 rounded-full pe-3 ps-2"
      )}
      aria-label={t("platform.listenOnAriaLabel", { platform: name })} // TODO: Add aria-label
    >
      <Icon size={18} />
      {t("platform.listenOn", { platform: name })}
    </Link>
  );
};
