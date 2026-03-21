import type { RawProfilePicture, RawProfileResponse } from './raw-types';
import type { ProfileBase, ProfileImageBase } from './types';

export function mapRawProfile(raw: RawProfileResponse): ProfileBase {
  const id = asNonEmptyString(raw.id, 'profile.id');
  const name = asNonEmptyString(raw.name, 'profile.name');
  const pictures = Array.isArray(raw.pictures) ? raw.pictures : [];
  const images = pictures
    .map((picture) => mapRawPicture(picture))
    .filter((image): image is ProfileImageBase => image !== null);

  return {
    id,
    name,
    onlineStatus: asOptionalString(raw.online_status),
    headline: asOptionalString(raw.headline),
    previewImage: mapRawPicture(raw.preview_pic),
    images,
  };
}

function mapRawPicture(raw: unknown): ProfileImageBase | null {
  if (!raw || typeof raw !== 'object') return null;
  const picture = raw as RawProfilePicture;

  const id = asOptionalString(picture.id);
  const token = asOptionalString(picture.url_token);
  if (!id || !token) return null;

  return {
    id,
    urlToken: token,
    width: asOptionalNumber(picture.width),
    height: asOptionalNumber(picture.height),
    rating: asOptionalString(picture.rating),
    isPublic: typeof picture.is_public === 'boolean' ? picture.is_public : null,
  };
}

function asOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function asNonEmptyString(value: unknown, fieldName: string): string {
  const normalized = asOptionalString(value);
  if (!normalized) {
    throw new Error(`Invalid ${fieldName}`);
  }
  return normalized;
}

function asOptionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}
