import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { SchnellcheckApiService } from './schnellcheck-api.service';
import { Antworten, Frage, SCHNELLCHECK } from './schnellcheck.definition';
import { evaluate, istVollstaendig } from './schnellcheck.scoring';

type Schritt = 'start' | number | 'ergebnis';
type SendeStatus = 'offen' | 'sendet' | 'gesendet' | 'fehler';
type Richtung = 'vor' | 'zurueck';

const AMPEL_LABEL = {
  gruen: 'Grün — derzeit geringe Hinweise auf Pflichten',
  gelb: 'Gelb — es gelten voraussichtlich bereits Pflichten',
  rot: 'Rot — Hochrisiko-Pflichten sind wahrscheinlich',
} as const;

@Component({
  selector: 'app-schnellcheck',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      @switch (schritt()) {
        @case ('start') {
          <p class="kicker einblenden" style="--reihenfolge: 0">Unverbindliche Orientierung</p>
          <h1 class="einblenden" style="--reihenfolge: 1">KI-Act Schnellcheck</h1>
          <p class="einblenden intro" style="--reihenfolge: 2">
            Beantworten Sie {{ anzahlFragen }} kurze Fragen zu Ihrem KI-Einsatz — danach sehen
            Sie eine Ampel-Einschätzung mit den wichtigsten Befunden für Ihr Unternehmen.
          </p>
          <ul class="fakten einblenden" style="--reihenfolge: 3">
            <li><strong>{{ anzahlFragen }}</strong> Fragen</li>
            <li><strong>≈ 3</strong> Minuten</li>
            <li><strong>0</strong> Anmeldung nötig</li>
          </ul>
          <ul class="leistungen einblenden" style="--reihenfolge: 4">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Ampel-Einschätzung sofort auf dem Bildschirm — ohne E-Mail-Adresse
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Die drei wichtigsten Befunde, priorisiert nach Risiko
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Optional: vollständige Auswertung mit Pflichten-Checkliste per E-Mail
            </li>
          </ul>
          <aside class="disclaimer einblenden" role="note" style="--reihenfolge: 5">
            {{ disclaimer }}
          </aside>
          <p class="einblenden" style="--reihenfolge: 6">
            <button type="button" class="primaer" (click)="starten()">
              Check starten
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </p>
        }
        @case ('ergebnis') {
          <h1 class="einblenden">Ihr Ergebnis</h1>
          @if (ergebnis(); as e) {
            <section class="ampel" [class]="'ampel--' + e.ampel" aria-labelledby="ampel-titel">
              <div class="ampel__lichter" aria-hidden="true">
                <span class="licht licht--rot"></span>
                <span class="licht licht--gelb"></span>
                <span class="licht licht--gruen"></span>
              </div>
              <div>
                <h2 id="ampel-titel" #ergebnisTitel tabindex="-1">{{ ampelLabel[e.ampel] }}</h2>
                <ul class="befunde">
                  @for (befund of e.befunde; track befund; let i = $index) {
                    <li class="einblenden" [style.--reihenfolge]="i + 3">{{ befund }}</li>
                  }
                </ul>
              </div>
            </section>

            <details class="angaben">
              <summary>Ihre Angaben im Überblick</summary>
              <ol>
                @for (frage of fragen; track frage.id; let i = $index) {
                  <li>
                    <div>
                      <span class="angaben__frage">{{ frage.text }}</span>
                      <span class="angaben__antwort">{{ gewaehlteTexte(frage) }}</span>
                    </div>
                    <button type="button" class="angaben__aendern" (click)="bearbeite(i)">
                      Ändern<span class="visually-hidden">: {{ frage.text }}</span>
                    </button>
                  </li>
                }
              </ol>
            </details>

            <aside class="disclaimer" role="note">{{ disclaimer }}</aside>

            <section class="email-gate" aria-labelledby="email-titel">
              <h2 id="email-titel">Vollständige Auswertung per E-Mail (optional)</h2>
              <p>
                Ihre vollständige Auswertung mit Pflichten-Checkliste senden wir Ihnen per
                E-Mail. Das Kurzergebnis oben bleibt selbstverständlich ohne Angabe einer
                E-Mail-Adresse sichtbar.
              </p>
              @switch (sendeStatus()) {
                @case ('gesendet') {
                  <p class="hinweis-erfolg" role="status">
                    Fast geschafft: Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie
                    den Link darin (Double-Opt-in) — erst dann senden wir die Auswertung.
                  </p>
                }
                @default {
                  <form (submit)="absenden($event)">
                    <div class="feld">
                      <label for="email">E-Mail-Adresse</label>
                      <input
                        id="email"
                        type="email"
                        autocomplete="email"
                        [formControl]="email"
                        [attr.aria-invalid]="email.invalid && email.touched ? true : null"
                        [attr.aria-describedby]="
                          email.invalid && email.touched ? 'email-fehler' : null
                        "
                      />
                      @if (email.invalid && email.touched) {
                        <p class="feld-fehler" id="email-fehler">
                          Bitte geben Sie eine gültige E-Mail-Adresse ein.
                        </p>
                      }
                    </div>
                    <div class="feld feld--checkbox">
                      <input id="einwilligung" type="checkbox" [formControl]="einwilligung" />
                      <label for="einwilligung">
                        Ich willige ein, dass meine E-Mail-Adresse und meine Antworten zur
                        Erstellung und Zusendung der Auswertung verarbeitet werden. Die
                        Einwilligung ist jederzeit widerrufbar — Details in der
                        <a routerLink="/datenschutz">Datenschutzerklärung</a>.
                      </label>
                    </div>
                    @if (einwilligung.invalid && einwilligung.touched) {
                      <p class="feld-fehler">Bitte bestätigen Sie die Einwilligung.</p>
                    }
                    @if (sendeStatus() === 'fehler') {
                      <p class="feld-fehler" role="alert">
                        Senden fehlgeschlagen. Bitte versuchen Sie es später erneut — Ihr
                        Kurzergebnis oben bleibt gültig.
                      </p>
                    }
                    <button type="submit" class="primaer" [disabled]="sendeStatus() === 'sendet'">
                      {{ sendeStatus() === 'sendet' ? 'Wird gesendet …' : 'Auswertung anfordern' }}
                    </button>
                  </form>
                }
              }
            </section>
            <p>
              <button type="button" class="sekundaer" (click)="neustarten()">
                Check neu starten
              </button>
            </p>
          }
        }
        @default {
          <div class="fortschritt">
            <span class="fortschritt__text" aria-hidden="true">
              Frage {{ frageNummer() }} von {{ anzahlFragen }}
            </span>
            <div class="fortschritt__balken" aria-hidden="true">
              <div
                class="fortschritt__wert"
                [style.width.%]="(frageNummer() / anzahlFragen) * 100"
              ></div>
            </div>
            <ol class="schritte" aria-label="Fragenübersicht — beantwortete Fragen sind anklickbar">
              @for (frage of fragen; track frage.id; let i = $index) {
                <li>
                  <button
                    type="button"
                    class="punkt"
                    [class.punkt--aktiv]="i === frageIndex()"
                    [class.punkt--beantwortet]="istFrageBeantwortet(frage.id)"
                    [disabled]="!istFrageBeantwortet(frage.id) && i !== frageIndex()"
                    [attr.aria-current]="i === frageIndex() ? 'step' : null"
                    [attr.aria-label]="
                      'Frage ' +
                      (i + 1) +
                      (istFrageBeantwortet(frage.id) ? ' (beantwortet)' : '')
                    "
                    (click)="springeZu(i)"
                  ></button>
                </li>
              }
            </ol>
          </div>
          @for (frage of aktuelleFrageListe(); track frage.id) {
            <form
              class="frage-karte"
              [class.wechsel--vor]="richtung() === 'vor'"
              [class.wechsel--zurueck]="richtung() === 'zurueck'"
              (submit)="weiter($event)"
            >
              <fieldset>
                <legend>
                  <span class="visually-hidden"
                    >Frage {{ frageNummer() }} von {{ anzahlFragen }}:
                  </span>
                  <span #frageTitel tabindex="-1">{{ frage.text }}</span>
                </legend>
                @if (frage.hinweis) {
                  <p class="frage-hinweis">{{ frage.hinweis }}</p>
                }
                <div class="optionen">
                  @for (option of frage.optionen; track option.id) {
                    <label
                      class="option"
                      [class.option--gewaehlt]="istGewaehlt(frage.id, option.id)"
                      [for]="frage.id + '-' + option.id"
                    >
                      <input
                        class="visually-hidden"
                        [type]="frage.typ === 'single' ? 'radio' : 'checkbox'"
                        [id]="frage.id + '-' + option.id"
                        [name]="frage.id"
                        [checked]="istGewaehlt(frage.id, option.id)"
                        (change)="waehle(frage, option.id)"
                      />
                      <span
                        class="option__indikator"
                        [class.option__indikator--eckig]="frage.typ === 'multi'"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                      <span class="option__text">{{ option.text }}</span>
                    </label>
                  }
                </div>
              </fieldset>
              @if (weiterVersucht() && !frageBeantwortet()) {
                <p class="feld-fehler" role="alert">Bitte wählen Sie eine Antwort aus.</p>
              }
              <div class="navigation">
                <button type="button" class="sekundaer" (click)="zurueck()">Zurück</button>
                <button type="submit" class="primaer">
                  {{ weiterLabel() }}
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          }
        }
      }
    </div>
  `,
  styles: `
    .kicker {
      font-size: var(--text-xs);
      font-weight: 650;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-accent);
      margin-bottom: var(--space-2);
    }

    .intro {
      color: var(--color-text-muted);
      font-size: var(--text-lg);
    }

    .fakten {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      margin-block: var(--space-5);

      li {
        border: 1px solid var(--color-accent-line);
        background: var(--color-accent-faint);
        border-radius: 999px;
        padding: var(--space-2) var(--space-4);
        font-size: var(--text-sm);
        color: var(--color-text-muted);

        strong {
          color: var(--color-accent);
          font-weight: 700;
        }
      }

      li + li {
        margin: 0;
      }
    }

    .leistungen {
      list-style: none;
      padding: 0;
      display: grid;
      gap: var(--space-3);

      li {
        display: flex;
        gap: var(--space-3);
        align-items: baseline;
      }

      svg {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        color: var(--color-risk-green);
        transform: translateY(2px);
      }
    }

    .disclaimer {
      border-left: 3px solid var(--color-accent);
      background: var(--color-accent-faint);
      padding: var(--space-3) var(--space-4);
      margin-block: var(--space-5);
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      border-radius: 0 var(--radius) var(--radius) 0;
    }

    .fortschritt {
      margin-bottom: var(--space-5);
    }

    .fortschritt__text {
      display: block;
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      font-weight: 600;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      margin-bottom: var(--space-2);
    }

    .fortschritt__balken {
      height: 6px;
      border-radius: 999px;
      background: var(--color-border);
      overflow: hidden;
    }

    .fortschritt__wert {
      height: 100%;
      border-radius: 999px;
      background: var(--verlauf-trikolore);
      transition: width var(--dauer-normal) var(--ease-out);
    }

    .schritte {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-3);
    }

    .punkt {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      background: var(--color-bg);
      padding: 0;
      cursor: pointer;
      transition:
        background var(--dauer-schnell) var(--ease-out),
        border-color var(--dauer-schnell) var(--ease-out),
        transform var(--dauer-schnell) var(--ease-out);

      &:disabled {
        cursor: default;
        opacity: 0.55;
      }

      &.punkt--beantwortet {
        background: var(--color-accent-line);
        border-color: var(--color-accent);

        &:hover:not(:disabled) {
          transform: scale(1.25);
        }
      }

      &.punkt--aktiv {
        background: var(--color-accent);
        border-color: var(--color-accent);
        transform: scale(1.15);
      }
    }

    // Fragenwechsel: gerichteter Kartenwechsel
    @keyframes karte-vor {
      from {
        opacity: 0;
        transform: translateX(28px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    @keyframes karte-zurueck {
      from {
        opacity: 0;
        transform: translateX(-28px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .frage-karte.wechsel--vor {
      animation: karte-vor var(--dauer-normal) var(--ease-out) both;
    }

    .frage-karte.wechsel--zurueck {
      animation: karte-zurueck var(--dauer-normal) var(--ease-out) both;
    }

    fieldset {
      border: none;
      margin: 0;
      padding: 0;
    }

    legend {
      font-size: var(--text-xl);
      font-weight: 680;
      letter-spacing: var(--tracking-tight);
      line-height: var(--leading-tight);
      margin-bottom: var(--space-3);

      span[tabindex]:focus-visible {
        outline: none;
      }
    }

    .frage-hinweis {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      margin-bottom: var(--space-4);
    }

    .optionen {
      display: grid;
      gap: var(--space-2);
      margin-block: var(--space-4);
    }

    // Ganze Karte ist das Label; natives Input bleibt (unsichtbar) für
    // Tastatur & Screenreader. Auswahlzustand kommt aus dem Komponenten-State,
    // nicht aus :has() — funktioniert damit in jedem Browser.
    .option {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--space-4);
      background: var(--color-bg-raised);
      cursor: pointer;
      user-select: none;
      transition:
        border-color var(--dauer-schnell) var(--ease-out),
        background var(--dauer-schnell) var(--ease-out),
        transform var(--dauer-schnell) var(--ease-out),
        box-shadow var(--dauer-schnell) var(--ease-out);

      &:hover {
        border-color: var(--color-border-strong);
        transform: translateX(3px);
        box-shadow: var(--shadow-sm);
      }

      // Tastaturfokus des versteckten Inputs sichtbar auf der Karte
      &:focus-within {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }
    }

    .option--gewaehlt {
      border-color: var(--color-accent);
      background: var(--color-accent-faint);
      box-shadow: var(--shadow-sm);

      .option__indikator {
        border-color: var(--color-accent);
        background: var(--color-accent);
        color: #fff;

        svg {
          opacity: 1;
          transform: scale(1);
        }
      }

      .option__text {
        font-weight: 600;
      }
    }

    .option__indikator {
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      background: var(--color-bg);
      color: transparent;
      transition:
        border-color var(--dauer-schnell) var(--ease-out),
        background var(--dauer-schnell) var(--ease-out);

      svg {
        width: 0.9rem;
        height: 0.9rem;
        opacity: 0;
        transform: scale(0.4);
        transition:
          opacity var(--dauer-schnell) var(--ease-out),
          transform var(--dauer-schnell) var(--ease-out);
      }

      &.option__indikator--eckig {
        border-radius: 6px;
      }
    }

    .option__text {
      flex: 1;
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      margin-top: var(--space-5);
    }

    .ampel {
      display: flex;
      gap: var(--space-5);
      align-items: flex-start;
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-block: var(--space-5);
      animation: aufskalieren var(--dauer-langsam) var(--ease-out) both;

      h2 {
        margin-bottom: var(--space-3);
        font-size: var(--text-xl);

        &:focus-visible {
          outline: none;
        }
      }
    }

    // Ampel-Lichter: das einzige „bunte" Element (WORKING MAP §7)
    .ampel__lichter {
      flex-shrink: 0;
      display: grid;
      gap: var(--space-2);
      background: var(--color-text);
      border-radius: 999px;
      padding: var(--space-2);
    }

    .licht {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      opacity: 0.22;

      &.licht--rot {
        background: var(--color-risk-red);
      }

      &.licht--gelb {
        background: #e3b341;
      }

      &.licht--gruen {
        background: var(--color-risk-green);
      }
    }

    .ampel--rot .licht--rot,
    .ampel--gelb .licht--gelb,
    .ampel--gruen .licht--gruen {
      opacity: 1;
      box-shadow: 0 0 12px 2px currentColor;
      animation: aufskalieren var(--dauer-langsam) var(--ease-out) both;
      animation-delay: 180ms;
    }

    .ampel--gruen {
      background: var(--color-risk-green-bg);
      border-left: 4px solid var(--color-risk-green);
    }

    .ampel--gelb {
      background: var(--color-risk-yellow-bg);
      border-left: 4px solid var(--color-risk-yellow);
    }

    .ampel--rot {
      background: var(--color-risk-red-bg);
      border-left: 4px solid var(--color-risk-red);
    }

    .befunde {
      margin: 0;
      padding-left: 1.25rem;

      li + li {
        margin-top: var(--space-2);
      }
    }

    .angaben {
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-bg-raised);
      margin-block: var(--space-5);

      summary {
        cursor: pointer;
        font-weight: 600;
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius);
        transition: background var(--dauer-schnell) var(--ease-out);

        &:hover {
          background: var(--color-accent-faint);
          color: var(--color-accent);
        }
      }

      ol {
        list-style: none;
        padding: 0 var(--space-4) var(--space-3);
        display: grid;

        li {
          display: flex;
          gap: var(--space-4);
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding-block: var(--space-3);
        }
      }
    }

    .angaben__frage {
      display: block;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .angaben__antwort {
      display: block;
      font-weight: 600;
    }

    .angaben__aendern {
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--color-border-strong);
      border-radius: 999px;
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition:
        border-color var(--dauer-schnell) var(--ease-out),
        color var(--dauer-schnell) var(--ease-out);

      &:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }
    }

    .email-gate {
      border: 1px solid var(--color-border);
      background: var(--color-bg-raised);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-block: var(--space-6);
      box-shadow: var(--shadow-sm);

      h2 {
        font-size: var(--text-lg);
        margin-bottom: var(--space-3);
      }

      > p {
        color: var(--color-text-muted);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchnellcheckComponent {
  private readonly api = inject(SchnellcheckApiService);

  protected readonly disclaimer = SCHNELLCHECK.disclaimer;
  protected readonly fragen = SCHNELLCHECK.fragen;
  protected readonly anzahlFragen = SCHNELLCHECK.fragen.length;
  protected readonly ampelLabel = AMPEL_LABEL;

  protected readonly schritt = signal<Schritt>('start');
  protected readonly antworten = signal<Antworten>({});
  protected readonly weiterVersucht = signal(false);
  protected readonly sendeStatus = signal<SendeStatus>('offen');
  protected readonly richtung = signal<Richtung>('vor');
  private readonly kamVomErgebnis = signal(false);

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly einwilligung = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });

  private readonly frageTitel = viewChild<ElementRef<HTMLElement>>('frageTitel');
  private readonly ergebnisTitel = viewChild<ElementRef<HTMLElement>>('ergebnisTitel');

  protected readonly frageIndex = computed(() => {
    const schritt = this.schritt();
    return typeof schritt === 'number' ? schritt : -1;
  });

  protected readonly aktuelleFrage = computed<Frage | undefined>(
    () => SCHNELLCHECK.fragen[this.frageIndex()],
  );

  /** Als Ein-Element-Liste, damit @for die Karte je Frage neu aufbaut (Animation). */
  protected readonly aktuelleFrageListe = computed<readonly Frage[]>(() => {
    const frage = this.aktuelleFrage();
    return frage ? [frage] : [];
  });

  protected readonly frageNummer = computed(() => this.frageIndex() + 1);

  protected readonly frageBeantwortet = computed(() => {
    const frage = this.aktuelleFrage();
    return !!frage && (this.antworten()[frage.id]?.length ?? 0) > 0;
  });

  protected readonly weiterLabel = computed(() => {
    if (this.kamVomErgebnis()) {
      return 'Zurück zum Ergebnis';
    }
    return this.frageNummer() === this.anzahlFragen ? 'Zum Ergebnis' : 'Weiter';
  });

  protected readonly ergebnis = computed(() =>
    this.schritt() === 'ergebnis' && istVollstaendig(SCHNELLCHECK, this.antworten())
      ? evaluate(SCHNELLCHECK, this.antworten())
      : undefined,
  );

  constructor() {
    inject(PageMetaService).setPage({
      title: 'KI-Act Schnellcheck — AI for Germany',
      description:
        'In 3 Minuten zur ersten Orientierung: Welche Pflichten des EU AI Act betreffen Ihr Unternehmen voraussichtlich? Unverbindlich und ohne Anmeldung.',
      path: '/schnellcheck',
    });
  }

  protected starten(): void {
    this.richtung.set('vor');
    this.schritt.set(0);
    this.fokusAufFrage();
  }

  protected istFrageBeantwortet(frageId: string): boolean {
    return (this.antworten()[frageId]?.length ?? 0) > 0;
  }

  protected springeZu(index: number): void {
    const aktuell = this.frageIndex();
    if (index === aktuell) {
      return;
    }
    this.richtung.set(index > aktuell ? 'vor' : 'zurueck');
    this.weiterVersucht.set(false);
    this.schritt.set(index);
    this.fokusAufFrage();
  }

  /** Aus der Ergebnis-Übersicht heraus eine Antwort ändern. */
  protected bearbeite(index: number): void {
    this.kamVomErgebnis.set(true);
    this.richtung.set('zurueck');
    this.schritt.set(index);
    this.fokusAufFrage();
  }

  protected gewaehlteTexte(frage: Frage): string {
    const auswahl = this.antworten()[frage.id] ?? [];
    return frage.optionen
      .filter((option) => auswahl.includes(option.id))
      .map((option) => option.text)
      .join(', ');
  }

  protected waehle(frage: Frage, optionId: string): void {
    this.antworten.update((antworten) => {
      const bisher = antworten[frage.id] ?? [];
      const auswahl =
        frage.typ === 'single'
          ? [optionId]
          : bisher.includes(optionId)
            ? bisher.filter((id) => id !== optionId)
            : [...bisher, optionId];
      return { ...antworten, [frage.id]: auswahl };
    });
  }

  protected istGewaehlt(frageId: string, optionId: string): boolean {
    return this.antworten()[frageId]?.includes(optionId) ?? false;
  }

  protected weiter(event: Event): void {
    event.preventDefault();
    if (!this.frageBeantwortet()) {
      this.weiterVersucht.set(true);
      return;
    }
    this.weiterVersucht.set(false);
    const index = this.frageIndex();
    if (index < 0) {
      return;
    }
    if (this.kamVomErgebnis() && istVollstaendig(SCHNELLCHECK, this.antworten())) {
      this.kamVomErgebnis.set(false);
      this.zeigeErgebnis();
      return;
    }
    if (index + 1 < this.anzahlFragen) {
      this.richtung.set('vor');
      this.schritt.set(index + 1);
      this.fokusAufFrage();
    } else {
      this.zeigeErgebnis();
    }
  }

  protected zurueck(): void {
    const index = this.frageIndex();
    this.weiterVersucht.set(false);
    this.kamVomErgebnis.set(false);
    this.richtung.set('zurueck');
    if (index === 0) {
      this.schritt.set('start');
    } else if (index > 0) {
      this.schritt.set(index - 1);
      this.fokusAufFrage();
    }
  }

  protected neustarten(): void {
    this.antworten.set({});
    this.sendeStatus.set('offen');
    this.kamVomErgebnis.set(false);
    this.email.reset();
    this.einwilligung.reset();
    this.richtung.set('vor');
    this.schritt.set('start');
  }

  protected absenden(event: Event): void {
    event.preventDefault();
    this.email.markAsTouched();
    this.einwilligung.markAsTouched();
    const ergebnis = this.ergebnis();
    if (this.email.invalid || this.einwilligung.invalid || !ergebnis) {
      return;
    }
    this.sendeStatus.set('sendet');
    this.api
      .sendeErgebnis({
        email: this.email.value,
        einwilligung: true,
        antworten: this.antworten(),
        ampel: ergebnis.ampel,
        befunde: ergebnis.befunde,
      })
      .subscribe({
        next: () => this.sendeStatus.set('gesendet'),
        error: () => this.sendeStatus.set('fehler'),
      });
  }

  private zeigeErgebnis(): void {
    this.schritt.set('ergebnis');
    queueMicrotask(() => this.ergebnisTitel()?.nativeElement.focus());
  }

  private fokusAufFrage(): void {
    queueMicrotask(() => this.frageTitel()?.nativeElement.focus());
  }
}
