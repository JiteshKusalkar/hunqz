import { Router } from 'express';

const base = process.env.HUNQZ_IMAGE_CDN_BASE_URL;

export const imageUrl = (token: string) => `${process.env.API_PUBLIC_URL}/images/${token}`;

const router = Router();

router.get('/:token', async (req, res) => {
  try {
    const upstreamResponse = await fetch(`${base}/${req.params.token}`);
    if (!upstreamResponse.ok) return res.status(upstreamResponse.status).end();

    const imageBytes = await upstreamResponse.arrayBuffer();
    res.set('content-type', upstreamResponse.headers.get('content-type') ?? 'image/jpeg');
    res.send(Buffer.from(imageBytes));
  } catch {
    res.status(502).json({ error: 'Failed to load image' });
  }
});

export { router as imagesRouter };
