import type { Response } from 'express';

type ErrorBody = { error: string };

export function sendError(res: Response, status: number, message: string) {
  const body: ErrorBody = { error: message };
  res.status(status).json(body);
}
