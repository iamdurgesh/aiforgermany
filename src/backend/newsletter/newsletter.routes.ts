import express from 'express';
import { BackendEnvironment } from '../config/environment';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { parseNewsletterSubscribeRequest } from './newsletter.validation';
import { NewsletterService } from './newsletter.service';

export function createNewsletterRouter(environment: BackendEnvironment): express.Router {
  const router = express.Router();
  const newsletterService = new NewsletterService(environment);

  router.post(
    '/subscribe',
    rateLimitMiddleware({
      windowMs: environment.apiRateLimitWindowMs,
      maxRequests: environment.newsletterRateLimitMaxRequests,
      keyPrefix: 'newsletter.subscribe',
    }),
    async (req, res, next) => {
      try {
        const payload = parseNewsletterSubscribeRequest(req.body);
        const result = await newsletterService.subscribe(payload);
        const statusCode = result.status === 'accepted' ? 202 : 503;

        res.status(statusCode).json({
          data: result,
          requestId: res.locals['requestId'] ?? null,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
