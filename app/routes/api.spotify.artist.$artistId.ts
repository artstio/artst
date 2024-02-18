import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getCachedArtist } from "~/models/spotify/artist/handlers";
import { authenticator } from "~/services/auth/config.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  const artistId = params.artistId;
  if (!artistId) {
    return json(null, { status: 404 });
  }

  const cachedArtist = await getCachedArtist({ id: artistId });

  return json(
    { artist: cachedArtist },
    {
      status: cachedArtist ? 200 : 404,
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  if (request.method !== "POST") {
    return json({}, { status: 400 });
  }

  const body = await request.json();

  console.log({ body });

  return json({});
}
