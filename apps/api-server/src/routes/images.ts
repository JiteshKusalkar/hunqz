import { Router } from 'express';

const UPSTREAM_IMAGE_BASE =
  process.env['HUNQZ_IMAGE_CDN_BASE_URL'] ?? 'https://www.hunqz.com/img/usr/original/256x256';

const router = Router();

router.get('/256x256/:token', async (req, res) => {
  const { token } = req.params;
  const filename = token?.trim();

  if (!filename || !filename.toLowerCase().endsWith('.jpg')) {
    res.status(400).json({ error: 'token must end with .jpg' });
    return;
  }

  const rawToken = filename.slice(0, -'.jpg'.length).trim();
  if (!rawToken) {
    res.status(400).json({ error: 'token is required' });
    return;
  }

  const upstreamUrl = `${UPSTREAM_IMAGE_BASE}/${encodeURIComponent(rawToken)}.jpg`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' },
    });

    if (!upstream.ok) {
      res.status(upstream.status).end();
      return;
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.set('content-type', contentType);
    res.set('cache-control', 'public, max-age=300');
    res.send(buffer);
  } catch {
    res.status(502).json({ error: 'Failed to load image' });
  }
});

export { router as imagesRouter };
