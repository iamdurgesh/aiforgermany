import { Env } from './env';

export interface ConfirmationMail {
  readonly to: string;
  readonly source: 'schnellcheck' | 'newsletter';
  readonly confirmationUrl: string;
}

export interface Mailer {
  sendConfirmation(mail: ConfirmationMail): Promise<void>;
}

/**
 * Placeholder until the EU mail provider is decided
 * (TODO-QUESTION.md #3: Brevo EU, Mailjet EU, or SMTP at the German host).
 * Only logs — no personal data ever leaves the system.
 */
class NoopMailer implements Mailer {
  async sendConfirmation(mail: ConfirmationMail): Promise<void> {
    console.log(
      `[mail:none] Double opt-in (${mail.source}) for ${mail.to}: ${mail.confirmationUrl}`,
    );
  }
}

export function createMailer(env: Env): Mailer {
  switch (env.MAIL_PROVIDER) {
    case 'none':
    case undefined:
      return new NoopMailer();
    default:
      // Fail hard on purpose: a configured but unimplemented provider must
      // not swallow mails silently.
      throw new Error(`Unknown MAIL_PROVIDER: ${env.MAIL_PROVIDER}`);
  }
}
