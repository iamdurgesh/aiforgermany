/** Input validation for both POST endpoints (WORKING MAP §6.9). */

const EMAIL_MAX_LENGTH = 254;
// Pragmatic check; the real verification is the double opt-in.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BODY_MAX_BYTES = 16_384;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(value);
}

/** Reads the JSON body with a size limit; null for an invalid or oversized body. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(length) || length > BODY_MAX_BYTES) {
    return null;
  }
  const text = await readBodyWithLimit(request);
  if (text === null) {
    return null;
  }
  try {
    const data: unknown = JSON.parse(text);
    return typeof data === 'object' && data !== null && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Reads the body as a stream and aborts as soon as the limit is exceeded
 * — otherwise e.g. a chunked request without Content-Length would be fully
 * buffered first and only discarded afterwards (memory DoS).
 */
async function readBodyWithLimit(request: Request): Promise<string | null> {
  if (!request.body) {
    return null;
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > BODY_MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(buffer);
}

/** Answers structure: Record<string, string[]> with tight size limits. */
export function isValidAnswers(value: unknown): value is Record<string, readonly string[]> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const entries = Object.entries(value);
  if (entries.length === 0 || entries.length > 30) {
    return false;
  }
  return entries.every(
    ([key, selection]) =>
      key.length <= 64 &&
      Array.isArray(selection) &&
      selection.length <= 20 &&
      selection.every((id) => typeof id === 'string' && id.length <= 64),
  );
}

export function isValidTrafficLight(value: unknown): value is 'green' | 'yellow' | 'red' {
  return value === 'green' || value === 'yellow' || value === 'red';
}

export function areValidFindings(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.length <= 5 &&
    value.every((f) => typeof f === 'string' && f.length <= 500)
  );
}

export function jsonResponse(status: number, data: Record<string, unknown>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
