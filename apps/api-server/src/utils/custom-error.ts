export class CustomError extends Error {
  readonly statusCode: number;
  readonly context?: Record<string, unknown>;

  constructor(statusCode: number, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.context = context;

    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace?.(this, CustomError);
  }
}
