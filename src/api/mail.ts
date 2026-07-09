import { Env } from './env';

export interface BestaetigungsMail {
  readonly an: string;
  readonly quelle: 'schnellcheck' | 'newsletter';
  readonly bestaetigungsUrl: string;
}

export interface Mailer {
  sendeBestaetigung(mail: BestaetigungsMail): Promise<void>;
}

/**
 * Platzhalter, bis der EU-Versanddienstleister entschieden ist
 * (TODO-QUESTION.md #3: Brevo EU, Mailjet EU oder SMTP beim deutschen Host).
 * Loggt nur — es verlässt keine personenbezogene Information das System.
 */
class NoopMailer implements Mailer {
  async sendeBestaetigung(mail: BestaetigungsMail): Promise<void> {
    console.log(
      `[mail:none] Double-Opt-in (${mail.quelle}) für ${mail.an}: ${mail.bestaetigungsUrl}`,
    );
  }
}

export function erstelleMailer(env: Env): Mailer {
  switch (env.MAIL_PROVIDER) {
    case 'none':
    case undefined:
      return new NoopMailer();
    default:
      // Bewusst hart scheitern: ein konfigurierter, aber nicht implementierter
      // Provider darf nicht stillschweigend Mails verschlucken.
      throw new Error(`Unbekannter MAIL_PROVIDER: ${env.MAIL_PROVIDER}`);
  }
}
