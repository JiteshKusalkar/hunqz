import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';

const cdnBase = process.env.HUNQZ_IMAGE_CDN_BASE_URL;

export const imageUrl = (token: string) => `${process.env.API_PUBLIC_URL}/images/${token}`;

const router = Router();

router.get(
  '/:token',
  async (req: Request<{ token: string }>, res: Response, next: NextFunction) => {
    try {
      const upstreamToken = req.params.token?.trim();

      if (!upstreamToken) {
        return next(new CustomError(400, 'token is required'));
      }

      const upstreamResponse = await fetch(`${cdnBase}/${upstreamToken}.jpg`);

      if (upstreamResponse.ok) {
        return next(new CustomError(502, 'Failed to load image'));
      }

      const imageBytes = await upstreamResponse.arrayBuffer();

      res.setHeader('Cache-Control', 'public, max-age=2678400');
      res.set('content-type', upstreamResponse.headers.get('content-type') ?? 'image/jpeg');
      return res.send(Buffer.from(imageBytes));
    } catch {
      return next(new CustomError(502, 'Failed to load image'));
    }
  },
);

export { router as imagesRouter };
