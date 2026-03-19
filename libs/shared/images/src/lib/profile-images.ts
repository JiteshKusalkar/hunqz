import { getJson } from '@hunqz/shared/api';
import type { RawProfilePicture, RawProfileResponse } from './raw-types';
import type { FetchProfileOptions, Profile, ProfileImage } from './types';

const DEFAULT_API_BASE_URL = 'https://www.hunqz.com';
const DEFAULT_PROFILE_NAME = 'msescortplus';
const IMAGE_BASE_URL = 'https://www.hunqz.com/img/usr/original/0x0';

export function buildProfileImageUrl(urlToken: string): string {
  const trimmed = urlToken.trim();
  if (!trimmed) {
    throw new Error('urlToken is required to build profile image URL');
  }
  return `${IMAGE_BASE_URL}/${encodeURIComponent(trimmed)}.jpg`;
}

export function mapRawProfile(raw: RawProfileResponse): Profile {
  const id = asNonEmptyString(raw.id, 'profile.id');
  const name = asNonEmptyString(raw.name, 'profile.name');
  const pictures = Array.isArray(raw.pictures) ? raw.pictures : [];
  const images = pictures
    .map((picture) => mapRawPicture(picture))
    .filter((image): image is ProfileImage => image !== null);

  return {
    id,
    name,
    onlineStatus: asOptionalString(raw.online_status),
    headline: asOptionalString(raw.headline),
    previewImage: mapRawPicture(raw.preview_pic),
    images,
  };
}

export async function fetchProfile(options: FetchProfileOptions = {}): Promise<Profile> {
  const profileName = options.profileName?.trim() || DEFAULT_PROFILE_NAME;
  const endpoint = `/api/opengrid/profiles/${encodeURIComponent(profileName)}`;
  const raw = await getJson<RawProfileResponse>(endpoint, {
    baseUrl: options.baseUrl ?? DEFAULT_API_BASE_URL,
    signal: options.signal,
  });
  return mapRawProfile(raw);
}

function mapRawPicture(raw: unknown): ProfileImage | null {
  if (!raw || typeof raw !== 'object') return null;
  const picture = raw as RawProfilePicture;

  const id = asOptionalString(picture.id);
  const token = asOptionalString(picture.url_token);
  if (!id || !token) return null;

  return {
    id,
    urlToken: token,
    imageUrl: buildProfileImageUrl(token),
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
