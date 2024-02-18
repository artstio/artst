import type { ReactNode } from "react";
import { NavLink } from "@remix-run/react";

import { cn } from "~/lib/utils";

export default function SettingsNavLink({
  to,
  children,
}: {
  to: string | null;
  children: ReactNode;
}) {
  const href = `/settings${to ? `/${to}` : ""}`;

  return (
    <NavLink
      key={href}
      to={href}
      className={cn(
        "rounded-md p-2.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200",
        "active:font-semibold active:text-black"
      )}
    >
      {children}
    </NavLink>
  );
}
