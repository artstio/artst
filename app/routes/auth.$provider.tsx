import type { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth/config.server";

export async function action({ params, request }: ActionFunctionArgs) {
  if (typeof params.provider !== "string") throw new Error("Invalid provider.");

  const user = await authenticator.authenticate(params.provider, request, {
    failureRedirect: "/login",
  });

  return user;
}

export default function Screen() {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      Whops! You should have already been redirected.
    </div>
  );
}
