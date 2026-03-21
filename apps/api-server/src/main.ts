import express from 'express';
import cors from 'cors';
import { profilesRouter } from './routes/profiles';
import { imagesRouter } from './routes/images';

const app = express();
const PORT = Number(process.env['PORT']) || 3333;

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
  }),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/profiles', profilesRouter);
app.use('/images', imagesRouter);

const server = app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
