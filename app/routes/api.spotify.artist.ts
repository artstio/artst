import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

import { authenticator } from "~/services/auth/config.server";
import { db } from "~/utils/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });

  await db.copyright.deleteMany({});
  await db.spotifyArtistImage.deleteMany({});
  await db.spotifyAlbumImage.deleteMany({});
  await db.spotifyTrack.deleteMany({});
  await db.spotifyAlbum.deleteMany({});
  await db.spotifyArtist.deleteMany({});

  return json({}, { status: 400 });
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
