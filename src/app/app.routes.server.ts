import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Static routes that are prerendered to HTML at build time.
 * Must match src/app/app.routes.ts and tools/build-content.mjs.
 */
const staticPrerenderPaths = [
  '',
  'artikel',
  'glossar',
  'schnellcheck',
  'newsletter',
  'ueber',
  'impressum',
  'datenschutz',
];

export const serverRoutes: ServerRoute[] = [
  ...staticPrerenderPaths.map(
    (path): ServerRoute => ({ path, renderMode: RenderMode.Prerender }),
  ),
  {
    path: 'artikel/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const { ARTICLES } = await import('./features/artikel/artikel.generated');
      return ARTICLES.map(({ slug }) => ({ slug }));
    },
  },
  // Unknown URLs are rendered server-side with status 404 (a real 404,
  // no soft 404 for search engines).
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
