import { CfRequest, Env } from './env';
import { confirm, newsletter, schnellcheckResult } from './handlers';
import { jsonResponse } from './validation';

/**
 * Best-effort rate limit per worker isolate (WORKING MAP §6.9).
 * Note: On Cloudflare, additionally configure a zone-wide WAF rate-limiting
 * rule for /api/* — this in-memory limit only protects per isolate.
 */
const WINDOW_MS = 60_000;
const MAX_POSTS_PER_WINDOW = 10;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_POSTS_PER_WINDOW) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  // Cap memory usage (clear out old entries)
  if (requestLog.size > 10_000) {
    requestLog.clear();
  }
  return false;
}

export async function handleApi(request: CfRequest, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);

  // Rate-limit all API methods — GET /api/confirm also triggers DB access.
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (isRateLimited(ip)) {
    return jsonResponse(429, { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' });
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
  } catch (error) {
    console.error('API error:', error);
    return jsonResponse(500, { error: 'Interner Fehler. Bitte später erneut versuchen.' });
  }

  return jsonResponse(404, { error: 'Unbekannter API-Endpunkt.' });
}
