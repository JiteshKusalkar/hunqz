import { Router } from 'express';
import { getJson } from '@hunqz/shared/api';
import { mapRawProfile } from '@hunqz/shared/images';
import type { RawProfileResponse, Profile, ProfileImage } from '@hunqz/shared/images';

const UPSTREAM_BASE_URL = process.env['HUNQZ_API_BASE_URL'] ?? 'https://www.hunqz.com';

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
    const profile = mapRawProfile(raw);
    const rewritten = rewriteImageUrls(profile);
    res.json(rewritten);
  } catch {
    res.status(502).json({ error: 'Failed to load profile' });
  }
});

function rewriteImageUrls(profile: Profile): Profile {
  const rewrite = (img: ProfileImage): ProfileImage => ({
    ...img,
    imageUrl: `/images/256x256/${encodeURIComponent(img.urlToken)}.jpg`,
  });

  return {
    ...profile,
    previewImage: profile.previewImage ? rewrite(profile.previewImage) : null,
    images: profile.images.map(rewrite),
  };
}

export { router as profilesRouter };
