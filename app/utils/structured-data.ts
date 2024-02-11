import type { Person, MusicAlbum } from "schema-dts";
import slugify from "slugify";

interface PersonInput {
  id: string;
  name: string;
  email?: string;
}

export const createPersonSD = ({ id, name, email }: PersonInput): Person => {
  return {
    "@type": "Person",
    identifier: id,
    name,
    email,
    url: `${
      global.ENV?.BASE_URL || "http://localhost:3000"
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
      global.ENV?.BASE_URL || "http://localhost:3000"
    }/albums/${slugify(name, {
      lower: true,
    })}`,
  };
};
