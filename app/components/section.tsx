import { Link } from "@remix-run/react";

import { Typography } from "./ui/typography";

export function Section({
  title,
  showAllProps,
  children,
}: {
  title: string;
  showAllProps?: {
    to: string;
    text: string;
    altText?: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h2" className="font-bold">
          {title}
        </Typography>

        {showAllProps ? (
          <Link
            to={showAllProps.to}
            aria-label={showAllProps.altText ?? `See all content for ${title}`}
          >
            <Typography
              variant="muted"
              size="sm"
              className="transition-all hover:text-white"
            >
              {showAllProps.text}
            </Typography>
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}
