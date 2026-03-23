import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { getJson } from '@hunqz/api';
import { mapRawProfile } from '../utils/profile-images';
import { imageUrl } from './images';
import { CustomError } from '../utils/custom-error';
import { RawProfileResponse } from '@hunqz/app-types';

const UPSTREAM_BASE_URL = process.env.HUNQZ_API_BASE_URL;

const router = Router();

router.get(
  '/:profileName',
  async (req: Request<{ profileName: string }>, res: Response, next: NextFunction) => {
    const normalizedName = req.params.profileName?.trim();

    if (!normalizedName) {
      return next(new CustomError(400, 'profileName is required'));
    }

    try {
      const endpoint = `/api/opengrid/profiles/${encodeURIComponent(normalizedName)}`;
      const raw = await getJson<RawProfileResponse>(endpoint, {
        baseUrl: UPSTREAM_BASE_URL,
      });

      const base = mapRawProfile(raw);

      return res.json({
        ...base,
        previewImage: base.previewImage
          ? {
              id: base.previewImage.id,
              imageUrl: imageUrl(base.previewImage.urlToken),
            }
          : null,
        images: base.images.map(({ id, urlToken }) => ({
          id,
          imageUrl: imageUrl(urlToken),
        })),
      });
    } catch {
      return next(new CustomError(502, 'Failed to load profile'));
    }
  },
);

export { router as profilesRouter };
