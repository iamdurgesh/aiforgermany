import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

import { bereinigeUnbestaetigteLeads } from './api/handlers';
import { CfRequest, Env } from './api/env';
import { handleApi } from './api/router';

const angularApp = new AngularAppEngine();

const PRIMAER_HOST = 'aiforgermany.de';
const WEITERLEITUNGS_HOSTS = new Set([
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

  // 301 auf die Primärdomain (WORKING MAP §1). Statische Asset-Pfade der
  // Nebendomains brauchen zusätzlich Zone-Level-Redirect-Rules (siehe README).
  if (WEITERLEITUNGS_HOSTS.has(url.hostname)) {
    url.hostname = PRIMAER_HOST;
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname.startsWith('/api/')) {
    if (!env) {
      // ng-serve-Dev-Server ohne Worker-Bindings: API nur unter `npm run preview`.
      return new Response('API nur in der Worker-Umgebung verfügbar.', { status: 501 });
    }
    return handleApi(request as CfRequest, env);
  }
  const response = await angularApp.handle(request);
  if (!response) {
    return new Response('Seite nicht gefunden.', { status: 404 });
  }
  return mitSicherheitsHeadern(response);
}

/**
 * Sicherheits-Header für SSR-Antworten (z. B. 404-Seiten). Statische Assets
 * bekommen dieselben Header über public/_headers.
 */
function mitSicherheitsHeadern(response: Response): Response {
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

  /** Cron-Trigger: unbestätigte Leads nach 30 Tagen löschen (WORKING MAP §6.7). */
  scheduled: async (_event: unknown, env: Env) => {
    const geloescht = await bereinigeUnbestaetigteLeads(env);
    console.log(`Retention-Job: ${geloescht} unbestätigte Leads gelöscht.`);
  },
};
