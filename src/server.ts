import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

async function handleRequest(request: Request): Promise<Response> {
  const response = await angularApp.handle(request);
  return response ?? new Response('Seite nicht gefunden.', { status: 404 });
}

/** Used by the Angular CLI dev server and during the build. */
export const reqHandler = createRequestHandler(handleRequest);

/** Cloudflare Workers entry point (see wrangler.jsonc). */
export default { fetch: handleRequest };
