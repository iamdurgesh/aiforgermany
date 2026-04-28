import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { siteConfig } from './app/core/config/site.config';
import { getLocaleFromPath, resolveRequestLocale, toLocalizedPath } from './app/core/i18n/locale.utils';
import { getEnvironment } from './backend/config/environment';
import { createApiRouter } from './backend/http/api.routes';

const browserDistFolder = join(import.meta.dirname, '../browser');
const canonicalSiteUrl = new URL(siteConfig.siteUrl);
const environment = getEnvironment();
const isProduction = environment.isProduction;
const requestBodyLimit = '100kb';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: false, limit: requestBodyLimit }));

app.use((req, res, next) => {
  if (isProduction && !req.secure) {
    return res.redirect(308, `${canonicalSiteUrl.origin}${req.originalUrl}`);
  }

  if (isProduction && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self' https:",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
  );

  return next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  if (getLocaleFromPath(req.path)) {
    return next();
  }

  if (req.path.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(req.path) || req.path.startsWith('/api/')) {
    return next();
  }

  const preferredLocale = resolveRequestLocale(req.path, req.acceptsLanguages() ?? []);
  const localizedPath = toLocalizedPath(preferredLocale, req.path);
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  return res.redirect(308, `${localizedPath}${query}`);
});

app.use('/api', createApiRouter(environment));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);

  if (res.headersSent) {
    return;
  }

  res.status(500).send(isProduction ? 'Internal Server Error' : 'Server Error');
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = environment.port;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
