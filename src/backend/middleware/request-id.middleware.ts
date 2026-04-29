import express from 'express';
import { randomUUID } from 'node:crypto';

export function requestIdMiddleware(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const requestId = req.header('x-request-id') ?? randomUUID();

  res.setHeader('X-Request-Id', requestId);
  res.locals['requestId'] = requestId;

  next();
}
