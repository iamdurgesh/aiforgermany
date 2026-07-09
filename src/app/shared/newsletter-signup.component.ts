import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type SendeStatus = 'offen' | 'sendet' | 'gesendet' | 'fehler';

/**
 * Newsletter-Anmeldung mit Double-Opt-in — geteilt zwischen /newsletter und
 * der Startseite (zweite Verwendung, WORKING MAP §2 DRY-Regel).
 */
@Component({
  selector: 'app-newsletter-signup',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @switch (status()) {
      @case ('gesendet') {
        <p class="hinweis-erfolg" role="status">
          Fast geschafft: Bitte bestätigen Sie den Link in der E-Mail, die wir Ihnen gerade
          geschickt haben (Double-Opt-in). Erst danach ist die Anmeldung wirksam.
        </p>
      }
      @default {
        <form (submit)="anmelden($event)">
          <div class="feld">
            <label for="newsletter-email">E-Mail-Adresse</label>
            <input
              id="newsletter-email"
              type="email"
              autocomplete="email"
              [formControl]="email"
              [attr.aria-invalid]="email.invalid && email.touched ? true : null"
              [attr.aria-describedby]="
                email.invalid && email.touched ? 'newsletter-email-fehler' : null
              "
            />
            @if (email.invalid && email.touched) {
              <p class="feld-fehler" id="newsletter-email-fehler">
                Bitte geben Sie eine gültige E-Mail-Adresse ein.
              </p>
            }
          </div>
          <div class="feld feld--checkbox">
            <input id="newsletter-einwilligung" type="checkbox" [formControl]="einwilligung" />
            <label for="newsletter-einwilligung">
              Ich willige ein, dass meine E-Mail-Adresse zum Versand des Newsletters
              verarbeitet wird. Abmeldung jederzeit über den Link in jeder Ausgabe — Details in
              der <a routerLink="/datenschutz">Datenschutzerklärung</a>.
            </label>
          </div>
          @if (einwilligung.invalid && einwilligung.touched) {
            <p class="feld-fehler">Bitte bestätigen Sie die Einwilligung.</p>
          }
          @if (status() === 'fehler') {
            <p class="feld-fehler" role="alert">
              Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.
            </p>
          }
          <button type="submit" class="primaer" [disabled]="status() === 'sendet'">
            {{ status() === 'sendet' ? 'Wird gesendet …' : 'Anmelden' }}
          </button>
        </form>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSignupComponent {
  private readonly http = inject(HttpClient);

  protected readonly status = signal<SendeStatus>('offen');

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly einwilligung = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });

  protected anmelden(event: Event): void {
    event.preventDefault();
    this.email.markAsTouched();
    this.einwilligung.markAsTouched();
    if (this.email.invalid || this.einwilligung.invalid) {
      return;
    }
    this.status.set('sendet');
    this.http
      .post<void>('/api/newsletter', { email: this.email.value, einwilligung: true })
      .subscribe({
        next: () => this.status.set('gesendet'),
        error: () => this.status.set('fehler'),
      });
  }
}
