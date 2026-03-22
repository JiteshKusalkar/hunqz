import type { RawProfilePicture, RawProfileResponse } from './raw-types';
import type { ProfileBase, ProfileImageBase } from './types';

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
    width: pic.width ?? null,
    height: pic.height ?? null,
    rating: pic.rating ?? null,
    isPublic: pic.is_public ?? null,
  };
}
