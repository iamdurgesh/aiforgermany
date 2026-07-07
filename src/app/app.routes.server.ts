import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Statische Routen, die beim Build als HTML prerendert werden.
 * Muss zu src/app/app.routes.ts und tools/build-content.mjs passen.
 */
const staticPrerenderPaths = ['', 'artikel', 'ueber', 'impressum', 'datenschutz'];

export const serverRoutes: ServerRoute[] = [
  ...staticPrerenderPaths.map(
    (path): ServerRoute => ({ path, renderMode: RenderMode.Prerender }),
  ),
  {
    path: 'artikel/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    async getPrerenderParams() {
      const { ARTIKEL } = await import('./features/artikel/artikel.generated');
      return ARTIKEL.map(({ slug }) => ({ slug }));
    },
  },
  // Unbekannte URLs werden serverseitig mit Status 404 gerendert (echtes 404,
  // kein Soft-404 für Suchmaschinen).
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
