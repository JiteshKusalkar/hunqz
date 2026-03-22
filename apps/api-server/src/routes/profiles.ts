import { Router } from 'express';
import { getJson } from '@hunqz/shared/api';
import { mapRawProfile } from '@hunqz/shared/images/server';
import type {
  RawProfileResponse,
  ProfileBase,
  ProfileImageBase,
} from '@hunqz/shared/images/server';
import type { Profile, ProfileImage } from '@hunqz/shared/images';

const UPSTREAM_BASE_URL = process.env.HUNQZ_API_BASE_URL;
const API_PUBLIC_URL = process.env.API_PUBLIC_URL;

const router = Router();

router.get('/:profileName', async (req, res) => {
  const { profileName } = req.params;
  const normalizedName = profileName?.trim();

  if (!normalizedName) {
    res.status(400).json({ error: 'profileName is required' });
    return;
  }

  try {
    const endpoint = `/api/opengrid/profiles/${encodeURIComponent(normalizedName)}`;
    const raw = await getJson<RawProfileResponse>(endpoint, {
      baseUrl: UPSTREAM_BASE_URL,
    });
    const base = mapRawProfile(raw);
    const profile = resolveImageUrls(base);
    res.json(profile);
  } catch {
    res.status(502).json({ error: 'Failed to load profile' });
  }
});

function resolveImageUrls(base: ProfileBase): Profile {
  const resolve = (img: ProfileImageBase): ProfileImage => ({
    id: img.id,
    imageUrl: `${API_PUBLIC_URL}/images/${encodeURIComponent(img.urlToken)}.jpg`,
    width: img.width,
    height: img.height,
    rating: img.rating,
    isPublic: img.isPublic,
  });

  return {
    ...base,
    previewImage: base.previewImage ? resolve(base.previewImage) : null,
    images: base.images.map(resolve),
  };
}

export { router as profilesRouter };
