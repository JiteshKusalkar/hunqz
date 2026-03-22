import { app } from './app';

const PORT = Number(process.env['PORT']) || 3333;

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
