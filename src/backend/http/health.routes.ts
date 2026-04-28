import express from 'express';
import { BackendEnvironment } from '../config/environment';

export function createHealthRouter(environment: BackendEnvironment): express.Router {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'aiforgermany',
      environment: environment.nodeEnv,
      newsletter: {
        enabled: environment.newsletterEnabled,
        provider: environment.newsletterProvider,
      },
      openAiApiKeyConfigured: environment.openAiApiKeyConfigured,
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
