import { HttpError } from '../shared/http-error';
import { NewsletterSubscribeRequest } from './newsletter.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 120;
const MAX_SOURCE_LENGTH = 120;

export function parseNewsletterSubscribeRequest(body: unknown): NewsletterSubscribeRequest {
  if (!isRecord(body)) {
    throw new HttpError(400, 'Invalid request body.', 'invalid_request');
  }

  const email = readString(body, 'email')?.trim().toLowerCase();
  const name = readString(body, 'name')?.trim();
  const source = readString(body, 'source')?.trim();
  const consentVersion = readString(body, 'consentVersion')?.trim();
  const privacyPolicyVersion = readString(body, 'privacyPolicyVersion')?.trim();
  const consentAccepted = body['consentAccepted'];

  const fieldErrors: Record<string, string> = {};

  if (!email || !EMAIL_PATTERN.test(email)) {
    fieldErrors['email'] = 'A valid email address is required.';
  }

  if (name && name.length > MAX_NAME_LENGTH) {
    fieldErrors['name'] = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (source && source.length > MAX_SOURCE_LENGTH) {
    fieldErrors['source'] = `Source must be ${MAX_SOURCE_LENGTH} characters or fewer.`;
  }

  if (consentAccepted !== true) {
    fieldErrors['consentAccepted'] = 'Consent must be explicitly accepted.';
  }

  if (!consentVersion) {
    fieldErrors['consentVersion'] = 'Consent version is required.';
  }

  if (!privacyPolicyVersion) {
    fieldErrors['privacyPolicyVersion'] = 'Privacy policy version is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw new HttpError(400, 'Newsletter subscription validation failed.', 'validation_failed', fieldErrors);
  }

  return {
    email: email as string,
    name: name || undefined,
    consentAccepted: true,
    consentVersion: consentVersion as string,
    privacyPolicyVersion: privacyPolicyVersion as string,
    source: source || undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key];
  return typeof value === 'string' ? value : undefined;
}
