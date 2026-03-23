export type RawProfilePicture = {
  id?: string;
  owner_id?: string;
  url_token?: string;
};

export type RawProfileResponse = {
  id?: string;
  name?: string;
  online_status?: string;
  headline?: string;
  preview_pic?: RawProfilePicture | null;
  pictures?: RawProfilePicture[];
};

export type ProfileImageBase = {
  id: string;
  urlToken: string;
};

export type ProfileBase = {
  id: string;
  name: string;
  onlineStatus: string | null;
  headline: string | null;
  previewImage: ProfileImageBase | null;
  images: ProfileImageBase[];
};

export function mapRawProfile(raw: RawProfileResponse): ProfileBase {
  if (!raw.id) throw new Error('Invalid profile.id');
  if (!raw.name) throw new Error('Invalid profile.name');

  const pictures = raw.pictures ?? [];

  return {
    id: raw.id,
    name: raw.name,
    onlineStatus: raw.online_status ?? null,
    headline: raw.headline ?? null,
    previewImage: raw.preview_pic ? mapPicture(raw.preview_pic) : null,
    images: pictures.map(mapPicture).filter((img): img is ProfileImageBase => img !== null),
  };
}

function mapPicture(pic: RawProfilePicture): ProfileImageBase | null {
  if (!pic.id || !pic.url_token) return null;

  return {
    id: pic.id,
    urlToken: pic.url_token,
  };
}
