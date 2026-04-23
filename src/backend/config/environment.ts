export interface BackendEnvironment {
  isProduction: boolean;
  nodeEnv: string;
  port: number;
  publicSiteUrl: string;
  apiRateLimitWindowMs: number;
  apiRateLimitMaxRequests: number;
  newsletterRateLimitMaxRequests: number;
  consentVersion: string;
  privacyPolicyVersion: string;
  newsletterEnabled: boolean;
  newsletterProvider: string;
  openAiApiKeyConfigured: boolean;
}

const DEFAULT_PORT = 4000;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_API_RATE_LIMIT_MAX_REQUESTS = 60;
const DEFAULT_NEWSLETTER_RATE_LIMIT_MAX_REQUESTS = 5;

export function getEnvironment(): BackendEnvironment {
  const nodeEnv = process.env['NODE_ENV'] ?? 'development';

  return {
    isProduction: nodeEnv === 'production',
    nodeEnv,
    port: readNumber('PORT', DEFAULT_PORT),
    publicSiteUrl: process.env['PUBLIC_SITE_URL'] ?? 'https://aiforgermany.de',
    apiRateLimitWindowMs: readNumber('API_RATE_LIMIT_WINDOW_MS', DEFAULT_RATE_LIMIT_WINDOW_MS),
    apiRateLimitMaxRequests: readNumber('API_RATE_LIMIT_MAX_REQUESTS', DEFAULT_API_RATE_LIMIT_MAX_REQUESTS),
    newsletterRateLimitMaxRequests: readNumber(
      'NEWSLETTER_RATE_LIMIT_MAX_REQUESTS',
      DEFAULT_NEWSLETTER_RATE_LIMIT_MAX_REQUESTS,
    ),
    consentVersion: process.env['CONSENT_VERSION'] ?? '2026-04-22',
    privacyPolicyVersion: process.env['PRIVACY_POLICY_VERSION'] ?? '2026-04-22',
    newsletterEnabled: process.env['NEWSLETTER_ENABLED'] === 'true',
    newsletterProvider: process.env['NEWSLETTER_PROVIDER'] ?? 'none',
    openAiApiKeyConfigured: Boolean(process.env['OPENAI_API_KEY']),
  };
}

function readNumber(name: string, fallback: number): number {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}
