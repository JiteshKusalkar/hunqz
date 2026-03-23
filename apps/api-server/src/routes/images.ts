import { Router } from 'express';
import { sendError } from './routeErrors';

const base = process.env.HUNQZ_IMAGE_CDN_BASE_URL;

export const imageUrl = (token: string) => `${process.env.API_PUBLIC_URL}/images/${token}`;

const router = Router();

router.get('/:token', async (req, res) => {
  try {
    const upstreamResponse = await fetch(`${base}/${req.params.token}`);
    if (!upstreamResponse.ok) return sendError(res, 502, 'Failed to load image');

    const imageBytes = await upstreamResponse.arrayBuffer();
    res.set('content-type', upstreamResponse.headers.get('content-type') ?? 'image/jpeg');
    res.send(Buffer.from(imageBytes));
  } catch {
    sendError(res, 502, 'Failed to load image');
  }
});

export { router as imagesRouter };
