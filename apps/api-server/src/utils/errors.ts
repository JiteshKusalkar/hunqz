import type { Request, Response } from 'express';
import { CustomError } from './custom-error';

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.context ? { context: err.context } : {}),
    });
  }

  if (err instanceof Error) {
    console.error(err.stack || err.message);

    return res.status(500).json({
      message: err.message || 'Something went wrong',
    });
  }

  console.error('Unknown error:', JSON.stringify(err, null, 2));

  return res.status(500).json({
    message: 'Something went wrong',
  });
};
