import express from 'express';
import { HttpError } from '../shared/http-error';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requestCounts = new Map<string, RateLimitEntry>();

export function rateLimitMiddleware(options: RateLimitOptions) {
  return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const now = Date.now();
    const key = `${options.keyPrefix}:${resolveClientIp(req)}`;
    const current = requestCounts.get(key);

    if (!current || current.resetAt <= now) {
      requestCounts.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });

      setRateLimitHeaders(res, options.maxRequests, options.maxRequests - 1, now + options.windowMs);
      return next();
    }

    if (current.count >= options.maxRequests) {
      setRateLimitHeaders(res, options.maxRequests, 0, current.resetAt);
      return next(new HttpError(429, 'Too many requests. Please try again later.', 'rate_limited'));
    }

    current.count += 1;
    setRateLimitHeaders(res, options.maxRequests, options.maxRequests - current.count, current.resetAt);
    return next();
  };
}

function resolveClientIp(req: express.Request): string {
  const forwardedFor = req.header('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || req.ip || req.socket.remoteAddress || 'unknown';
}

function setRateLimitHeaders(res: express.Response, limit: number, remaining: number, resetAt: number): void {
  res.setHeader('RateLimit-Limit', String(limit));
  res.setHeader('RateLimit-Remaining', String(Math.max(remaining, 0)));
  res.setHeader('RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
}
