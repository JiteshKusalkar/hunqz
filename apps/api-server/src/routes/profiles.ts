import { Router } from 'express';
import { getJson } from '@hunqz/api';
import { mapRawProfile } from '@hunqz/images/server';
import type { RawProfileResponse } from '@hunqz/images/server';
import { imageUrl } from './images';
import { sendError } from './routeErrors';

const UPSTREAM_BASE_URL = process.env.HUNQZ_API_BASE_URL;

const router = Router();

router.get('/:profileName', async (req, res) => {
  const { profileName } = req.params;
  const normalizedName = profileName?.trim();

  if (!normalizedName) {
    sendError(res, 400, 'profileName is required');
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
    sendError(res, 502, 'Failed to load profile');
  }
});

export { router as profilesRouter };
