import { Router } from 'express';
import { getJson } from '@hunqz/shared/api';
import { mapRawProfile } from '@hunqz/shared/images/server';
import type { RawProfileResponse } from '@hunqz/shared/images/server';
import { imageUrl } from './images';

const UPSTREAM_BASE_URL = process.env.HUNQZ_API_BASE_URL;

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
    res.json({
      ...base,
      previewImage: base.previewImage
        ? { id: base.previewImage.id, imageUrl: imageUrl(base.previewImage.urlToken) }
        : null,
      images: base.images.map(({ id, urlToken }) => ({ id, imageUrl: imageUrl(urlToken) })),
    });
  } catch {
    res.status(502).json({ error: 'Failed to load profile' });
  }
});

export { router as profilesRouter };
