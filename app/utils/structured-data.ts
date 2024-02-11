import { Person, MusicAlbum, MusicRelease } from "schema-dts";
import slugify from "slugify";
import { getSharedEnvs } from "./envs";

type PersonInput = {
  id: string;
  name: string;
  email?: string;
};

export const createPersonSD = ({ id, name, email }: PersonInput): Person => {
  return {
    "@type": "Person",
    identifier: id,
    name,
    email,
    url: `${
      global.ENV?.DEV_HOST_URL || "http://localhost:3000"
    }/artists/${slugify(name, {
      lower: true,
    })}`,
  };
};

export const createMusicAlbumSD = (
  name: string,
  artist: Person
): MusicAlbum => {
  return {
    "@type": "MusicAlbum",
    name,

    // video // TODO: Add video
    byArtist: artist,
    url: `${
      global.ENV?.DEV_HOST_URL || "http://localhost:3000"
    }/albums/${slugify(name, {
      lower: true,
    })}`,
  };
};
