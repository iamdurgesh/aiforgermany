import express from 'express';
import { isHttpError } from '../shared/http-error';

export function apiErrorMiddleware(
  error: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
): void {
  if (res.headersSent) {
    return;
  }

  if (isHttpError(error)) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      requestId: res.locals['requestId'] ?? null,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    error: {
      code: 'internal_server_error',
      message: 'Internal server error',
    },
    requestId: res.locals['requestId'] ?? null,
  });
}
