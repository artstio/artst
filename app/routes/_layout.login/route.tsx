import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { authenticator } from "~/services/auth/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/account",
  });
  return json({});
}

export default function Login() {
  return (
    <div className="h-full">
      {/* Outlet. */}
      <Outlet />
    </div>
  );
}
