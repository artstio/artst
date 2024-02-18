import { Typography } from "~/components/ui/typography";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  badges?: React.ReactNode;
  withGutter?: boolean;
  withBorder?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  description,
  badges,
  actions,
  withGutter,
  withBorder,
}: PageHeaderProps) {
  return (
    <div
      className={cn("grid gap-4 py-4 sm:gap-4 md:py-8", {
        "border-b": withBorder,
        "px-4 md:px-6": withGutter,
      })}
    >
      <div className="flex justify-between">
        <div className="grow-0">
          <div className="flex flex-col items-start gap-2 md:gap-4">
            <Typography
              as="h1"
              variant="large"
              className="flex items-center gap-2"
            >
              {title}
            </Typography>

            {badges ? badges : null}
          </div>

          {subtitle ? (
            <Typography variant="secondary">{subtitle}</Typography>
          ) : null}
          {description ? (
            <div>
              {/* <Balancer> */}
              <Typography variant="muted" className="mt-2" size="sm">
                {description}
              </Typography>
              {/* </Balancer> */}
            </div>
          ) : null}
        </div>

        {actions ? <div className="grow-0">{actions}</div> : null}
      </div>
    </div>
  );
}
