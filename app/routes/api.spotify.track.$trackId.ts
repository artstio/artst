import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getCachedAlbum } from "~/models/spotify/album";
// import { getCachedArtist } from "~/models/spotify/artist";
import { authenticator } from "~/services/auth/config.server";

export async function loader({ params }: LoaderFunctionArgs) {
  // await authenticator.isAuthenticated(request, { failureRedirect: '/login' });

  const { albumId } = params;
  if (!albumId) {
    return json(null, { status: 404 });
  }

  const album = await getCachedAlbum(albumId);
  return json({ album });
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
