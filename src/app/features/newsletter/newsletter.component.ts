import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageMetaService } from '../../core/page-meta.service';
import { NewsletterSignupComponent } from '../../shared/newsletter-signup.component';

@Component({
  selector: 'app-newsletter',
  imports: [NewsletterSignupComponent],
  template: `
    <div class="page">
      <h1>KI-Regulierung in 5 Minuten</h1>
      <p>
        Einmal im Monat das Wichtigste zu EU AI Act, KI-Aufsicht und KI-Einsatz im Mittelstand —
        kompakt aufbereitet für IT-Leitung, Datenschutz und Geschäftsführung. Kein Marketing,
        keine Weitergabe Ihrer Daten, Abmeldung mit einem Klick in jeder Ausgabe.
      </p>
      <ul>
        <li>Neue Fristen und was sie konkret bedeuten</li>
        <li>Ein Praxisthema pro Ausgabe (z. B. KI-Inventar, Schatten-KI, Richtlinien)</li>
        <li>Kurzantworten auf häufige Leserfragen</li>
      </ul>
      <app-newsletter-signup />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
  constructor() {
    inject(PageMetaService).setPage({
      title: 'Newsletter: KI-Regulierung in 5 Minuten — AI for Germany',
      description:
        'Monatlicher Newsletter für den Mittelstand: EU AI Act, Fristen und KI-Praxisthemen in 5 Minuten. Double-Opt-in, jederzeit abbestellbar.',
      path: '/newsletter',
    });
  }
}
