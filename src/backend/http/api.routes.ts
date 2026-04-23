import express from 'express';
import { BackendEnvironment } from '../config/environment';
import { createHealthRouter } from './health.routes';
import { requestIdMiddleware } from '../middleware/request-id.middleware';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { apiErrorMiddleware } from '../middleware/error.middleware';
import { createNewsletterRouter } from '../newsletter/newsletter.routes';

export function createApiRouter(environment: BackendEnvironment): express.Router {
  const router = express.Router();

  router.use(requestIdMiddleware);
  router.use(
    rateLimitMiddleware({
      windowMs: environment.apiRateLimitWindowMs,
      maxRequests: environment.apiRateLimitMaxRequests,
      keyPrefix: 'api',
    }),
  );

  router.use('/health', createHealthRouter(environment));
  router.use('/newsletter', createNewsletterRouter(environment));

  router.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'not_found',
        message: 'API route not found.',
      },
      requestId: res.locals['requestId'] ?? null,
    });
  });

  router.use(apiErrorMiddleware);

  return router;
}
