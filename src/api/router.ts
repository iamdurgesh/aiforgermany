import { CfRequest, Env } from './env';
import { confirm, newsletter, schnellcheckResult } from './handlers';
import { jsonAntwort } from './validation';

/**
 * Best-Effort-Rate-Limit pro Worker-Isolate (WORKING MAP §6.9).
 * Hinweis: Auf Cloudflare zusätzlich eine zonenweite WAF-Rate-Limiting-Regel
 * für /api/* konfigurieren — dieses In-Memory-Limit schützt nur je Isolate.
 */
const FENSTER_MS = 60_000;
const MAX_POSTS_PRO_FENSTER = 10;
const anfragen = new Map<string, number[]>();

function istRateLimitiert(ip: string): boolean {
  const jetzt = Date.now();
  const bisher = (anfragen.get(ip) ?? []).filter((t) => jetzt - t < FENSTER_MS);
  if (bisher.length >= MAX_POSTS_PRO_FENSTER) {
    anfragen.set(ip, bisher);
    return true;
  }
  bisher.push(jetzt);
  anfragen.set(ip, bisher);
  // Speicher begrenzen (alte Einträge räumen)
  if (anfragen.size > 10_000) {
    anfragen.clear();
  }
  return false;
}

export async function handleApi(request: CfRequest, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);

  // Alle API-Methoden limitieren — auch GET /api/confirm löst DB-Zugriffe aus.
  const ip = request.headers.get('cf-connecting-ip') ?? 'unbekannt';
  if (istRateLimitiert(ip)) {
    return jsonAntwort(429, { fehler: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
  }

  try {
    if (pathname === '/api/schnellcheck-result' && request.method === 'POST') {
      return await schnellcheckResult(request, env);
    }
    if (pathname === '/api/newsletter' && request.method === 'POST') {
      return await newsletter(request, env);
    }
    if (pathname === '/api/confirm' && request.method === 'GET') {
      return await confirm(request, env);
    }
  } catch (fehler) {
    console.error('API-Fehler:', fehler);
    return jsonAntwort(500, { fehler: 'Interner Fehler. Bitte später erneut versuchen.' });
  }

  return jsonAntwort(404, { fehler: 'Unbekannter API-Endpunkt.' });
}
