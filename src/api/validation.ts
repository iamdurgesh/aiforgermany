/** Input validation for both POST endpoints (WORKING MAP §6.9). */
import { SCHNELLCHECK } from '../app/features/schnellcheck/schnellcheck.definition';
import type {
  ApiErrorResponseDto,
  ConfirmationRequiredResponseDto,
  NewsletterRequestDto,
  SchnellcheckResultRequestDto,
} from './dto';

const EMAIL_MAX_LENGTH = 254;
// Pragmatic check; the real verification is the double opt-in.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BODY_MAX_BYTES = 16_384;

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(value);
}

export function isNewsletterRequest(value: unknown): value is NewsletterRequestDto {
  if (!isObjectRecord(value)) {
    return false;
  }
  return isValidEmail(value['email']) && value['consent'] === true;
}

export function isSchnellcheckResultRequest(
  value: unknown,
): value is SchnellcheckResultRequestDto {
  if (!isObjectRecord(value)) {
    return false;
  }
  return isNewsletterRequest(value) && isValidAnswers(value['answers']);
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
    return isObjectRecord(data) ? data : null;
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

/**
 * Answers must match the active Schnellcheck definition exactly. This keeps
 * stored answer JSON constrained to known question/option ids.
 */
export function isValidAnswers(value: unknown): value is Record<string, readonly string[]> {
  if (!isObjectRecord(value)) {
    return false;
  }
  const questionIds = new Set(SCHNELLCHECK.questions.map((question) => question.id));
  const providedQuestionIds = Object.keys(value);
  if (
    providedQuestionIds.length !== questionIds.size ||
    providedQuestionIds.some((questionId) => !questionIds.has(questionId))
  ) {
    return false;
  }

  return SCHNELLCHECK.questions.every((question) => {
    const selection = value[question.id];
    if (!Array.isArray(selection)) {
      return false;
    }
    const optionIds = new Set(question.options.map((option) => option.id));
    const selectedIds = new Set(selection);
    const expectedLength = question.type === 'single' ? 1 : selection.length;
    return (
      selection.length > 0 &&
      selection.length === expectedLength &&
      selectedIds.size === selection.length &&
      selection.every((id) => typeof id === 'string' && optionIds.has(id))
    );
  });
}

export function jsonResponse(
  status: number,
  data: ConfirmationRequiredResponseDto | ApiErrorResponseDto,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
