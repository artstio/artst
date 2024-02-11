import { ReactNode } from "react";

import { PageHeader } from "./page";
import { MaxWidthWrapper } from "./page/max-width-wrapper";
import SettingsNavLink from "./settings-nav-link";

export default function SettingsLayout({
  tabs,
  children,
}: {
  tabs: {
    name: string;
    segment: string | null;
  }[];
  children: ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-16px)] bg-white">
      <PageHeader title="Settings" />
      <MaxWidthWrapper className="grid items-start gap-5 pt-4 pb-8 md:grid-cols-5">
        <div className="top-36 flex gap-1 md:sticky md:grid">
          {tabs.map(({ name, segment }) => (
            <SettingsNavLink key={`${name}-${segment}`} to={segment}>
              {name}
            </SettingsNavLink>
          ))}
        </div>
        <div className="grid gap-5 md:col-span-4">{children}</div>
      </MaxWidthWrapper>
    </div>
  );
}
