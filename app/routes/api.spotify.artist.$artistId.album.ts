import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { getCachedArtistAlbums } from "~/models/spotify/album";
import { authenticator } from "~/services/auth/config.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // await authenticator.isAuthenticated(request, { failureRedirect: '/login' });

  const artistId = params.artistId;
  if (!artistId) {
    return json(null, { status: 404 });
  }

  const albums = await getCachedArtistAlbums(artistId);
  return json({ albums });
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
