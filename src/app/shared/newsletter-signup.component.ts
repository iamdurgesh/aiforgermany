import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Newsletter sign-up with double opt-in — shared between /newsletter and
 * the home page (second usage, WORKING MAP §2 DRY rule).
 */
@Component({
  selector: 'app-newsletter-signup',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @switch (status()) {
      @case ('sent') {
        <p class="success-note" role="status">
          Fast geschafft: Bitte bestätigen Sie den Link in der E-Mail, die wir Ihnen gerade
          geschickt haben (Double-Opt-in). Erst danach ist die Anmeldung wirksam.
        </p>
      }
      @default {
        <form (submit)="signUp($event)">
          <div class="field">
            <label for="newsletter-email">E-Mail-Adresse</label>
            <input
              id="newsletter-email"
              type="email"
              autocomplete="email"
              [formControl]="email"
              [attr.aria-invalid]="email.invalid && email.touched ? true : null"
              [attr.aria-describedby]="
                email.invalid && email.touched ? 'newsletter-email-error' : null
              "
            />
            @if (email.invalid && email.touched) {
              <p class="field-error" id="newsletter-email-error">
                Bitte geben Sie eine gültige E-Mail-Adresse ein.
              </p>
            }
          </div>
          <div class="field field--checkbox">
            <input id="newsletter-consent" type="checkbox" [formControl]="consent" />
            <label for="newsletter-consent">
              Ich willige ein, dass meine E-Mail-Adresse zum Versand des Newsletters
              verarbeitet wird. Abmeldung jederzeit über den Link in jeder Ausgabe — Details in
              der <a routerLink="/datenschutz">Datenschutzerklärung</a>.
            </label>
          </div>
          @if (consent.invalid && consent.touched) {
            <p class="field-error">Bitte bestätigen Sie die Einwilligung.</p>
          }
          @if (status() === 'error') {
            <p class="field-error" role="alert">
              Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.
            </p>
          }
          <button type="submit" class="primary" [disabled]="status() === 'sending'">
            {{ status() === 'sending' ? 'Wird gesendet …' : 'Anmelden' }}
          </button>
        </form>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSignupComponent {
  private readonly http = inject(HttpClient);

  protected readonly status = signal<SubmitStatus>('idle');

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly consent = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });

  protected signUp(event: Event): void {
    event.preventDefault();
    this.email.markAsTouched();
    this.consent.markAsTouched();
    if (this.email.invalid || this.consent.invalid) {
      return;
    }
    this.status.set('sending');
    this.http
      .post<void>('/api/newsletter', { email: this.email.value, consent: true })
      .subscribe({
        next: () => this.status.set('sent'),
        error: () => this.status.set('error'),
      });
  }
}
