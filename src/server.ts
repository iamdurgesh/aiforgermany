import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

import { cleanupUnconfirmedLeads } from './api/handlers';
import { CfRequest, Env } from './api/env';
import { handleApi } from './api/router';

const angularApp = new AngularAppEngine();

const PRIMARY_HOST = 'aiforgermany.de';
const REDIRECT_HOSTS = new Set([
  'www.aiforgermany.de',
  'aiforgermany.com',
  'www.aiforgermany.com',
  'aiingermany.de',
  'www.aiingermany.de',
  'aiingermany.com',
  'www.aiingermany.com',
]);

async function handleRequest(request: Request, env?: Env): Promise<Response> {
  const url = new URL(request.url);

  // 301 to the primary domain (WORKING MAP §1). Static asset paths of the
  // secondary domains additionally need zone-level redirect rules (see README).
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = PRIMARY_HOST;
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname.startsWith('/api/')) {
    if (!env) {
      // ng-serve dev server without worker bindings: API only under `npm run preview`.
      return new Response('API only available in the worker environment.', { status: 501 });
    }
    return handleApi(request as CfRequest, env);
  }
  const response = await angularApp.handle(request);
  if (!response) {
    return new Response('Seite nicht gefunden.', { status: 404 });
  }
  return withSecurityHeaders(response);
}

/**
 * Security headers for SSR responses (e.g. 404 pages). Static assets get
 * the same headers via public/_headers.
 */
function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return new Response(response.body, { status: response.status, headers });
}

/** Used by the Angular CLI dev server and during the build. */
export const reqHandler = createRequestHandler((request) => handleRequest(request));

/** Cloudflare Workers entry point (see wrangler.jsonc). */
export default {
  fetch: (request: Request, env: Env) => handleRequest(request, env),

  /** Cron trigger: delete unconfirmed leads after 30 days (WORKING MAP §6.7). */
  scheduled: async (_event: unknown, env: Env) => {
    const deletedCount = await cleanupUnconfirmedLeads(env);
    console.log(`Retention job: deleted ${deletedCount} unconfirmed leads.`);
  },
};
