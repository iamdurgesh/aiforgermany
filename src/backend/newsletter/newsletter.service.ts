import { BackendEnvironment } from '../config/environment';
import { NewsletterSubscribeRequest, NewsletterSubscribeResult } from './newsletter.types';

export class NewsletterService {
  constructor(private readonly environment: BackendEnvironment) {}

  async subscribe(request: NewsletterSubscribeRequest): Promise<NewsletterSubscribeResult> {
    if (!this.environment.newsletterEnabled || this.environment.newsletterProvider === 'none') {
      this.logConsentAttempt(request, 'not_configured');

      return {
        status: 'not_configured',
        provider: this.environment.newsletterProvider,
        message: 'Newsletter provider is not configured yet.',
      };
    }

    this.logConsentAttempt(request, 'accepted');

    return {
      status: 'accepted',
      provider: this.environment.newsletterProvider,
      message: 'Subscription request accepted.',
    };
  }

  private logConsentAttempt(request: NewsletterSubscribeRequest, status: NewsletterSubscribeResult['status']): void {
    console.info('newsletter.subscribe', {
      status,
      provider: this.environment.newsletterProvider,
      emailHash: hashEmailForLogs(request.email),
      consentVersion: request.consentVersion,
      privacyPolicyVersion: request.privacyPolicyVersion,
      source: request.source,
      timestamp: new Date().toISOString(),
    });
  }
}

function hashEmailForLogs(email: string): string {
  let hash = 0;

  for (const character of email) {
    hash = (hash << 5) - hash + character.charCodeAt(0);
    hash |= 0;
  }

  return `email_${Math.abs(hash)}`;
}
