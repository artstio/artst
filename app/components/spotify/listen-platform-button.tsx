import { Link } from "@remix-run/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Icons } from "~/components/shared/icons";

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
  }, []);

  const { t } = useTranslation("common");

  return (
    <Button asChild variant="ghost" size="sm" className="rounded-full">
      <Link
        to={url}
        className="flex gap-2 items-center"
        aria-label={t("platform.listenOnAriaLabel", { platform: name })} // TODO: Add aria-label
      >
        <Icon size={18} />
        {t("platform.listenOn", { platform: name })}
      </Link>
    </Button>
  );
};
