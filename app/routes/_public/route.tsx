import type { LoaderFunctionArgs } from "@remix-run/node";
import type { User } from "@prisma/client";

import { redirect, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { authenticator } from "~/services/auth/config.server";

import { Navigation } from "~/components/navigation";
import { Footer } from "~/components/footer";
import { MaxWidthWrapper } from "~/components/page/max-width-wrapper";
import { PageContent } from "~/components/page";

export default function Layout() {
  return (
    <>
      {/* Outlet. */}
      <Outlet />

      {/* Footer. */}
      <Footer />
    </>
  );
}
