import express from 'express';
import cors from 'cors';
import { profilesRouter } from './routes/profiles';
import { imagesRouter } from './routes/images';

const allowedOrigins = (
  process.env['CORS_ORIGINS'] ?? 'http://localhost:3000,http://localhost:4200'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const app = express();

app.use(cors({ origin: allowedOrigins }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/profiles', profilesRouter);
app.use('/images', imagesRouter);
