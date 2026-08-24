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
import { Answers, Question, SCHNELLCHECK } from './schnellcheck.definition';
import { evaluate, isComplete } from './schnellcheck.scoring';

type Step = 'start' | number | 'result';
type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';
type Direction = 'forward' | 'back';

const TRAFFIC_LIGHT_LABEL = {
  green: 'Grün — derzeit geringe Hinweise auf Pflichten',
  yellow: 'Gelb — es gelten voraussichtlich bereits Pflichten',
  red: 'Rot — Hochrisiko-Pflichten sind wahrscheinlich',
} as const;

@Component({
  selector: 'app-schnellcheck',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      @switch (step()) {
        @case ('start') {
          <p class="kicker fade-in" style="--stagger: 0">Unverbindliche Orientierung</p>
          <h1 class="fade-in" style="--stagger: 1">KI-Act Schnellcheck</h1>
          <p class="fade-in intro" style="--stagger: 2">
            Beantworten Sie {{ questionCount }} kurze Fragen zu Ihrem KI-Einsatz — danach sehen Sie
            eine Ampel-Einschätzung mit den wichtigsten Befunden für Ihr Unternehmen.
          </p>
          <ul class="facts fade-in" style="--stagger: 3">
            <li>
              <strong>{{ questionCount }}</strong> Fragen
            </li>
            <li><strong>≈ 3</strong> Minuten</li>
            <li><strong>0</strong> Anmeldung nötig</li>
          </ul>
          <ul class="benefits fade-in" style="--stagger: 4">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 12l5 5L20 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Ampel-Einschätzung sofort auf dem Bildschirm — ohne E-Mail-Adresse
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 12l5 5L20 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Die drei wichtigsten Befunde, priorisiert nach Risiko
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 12l5 5L20 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Optional: vollständige Auswertung mit Pflichten-Checkliste per E-Mail
            </li>
          </ul>
          <aside class="disclaimer fade-in" role="note" style="--stagger: 5">
            {{ disclaimer }}
          </aside>
          <p class="fade-in" style="--stagger: 6">
            <button type="button" class="primary" (click)="start()">
              Check starten
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </p>
        }
        @case ('result') {
          <h1 class="fade-in">Ihr Ergebnis</h1>
          @if (result(); as r) {
            <section
              class="traffic-light"
              [class]="'traffic-light--' + r.trafficLight"
              aria-labelledby="traffic-light-title"
            >
              <div class="traffic-light__lights" aria-hidden="true">
                <span class="light light--red"></span>
                <span class="light light--yellow"></span>
                <span class="light light--green"></span>
              </div>
              <div>
                <h2 id="traffic-light-title" #resultTitle tabindex="-1">
                  {{ trafficLightLabel[r.trafficLight] }}
                </h2>
                <ul class="findings">
                  @for (finding of r.findings; track finding; let i = $index) {
                    <li class="fade-in" [style.--stagger]="i + 3">{{ finding }}</li>
                  }
                </ul>
              </div>
            </section>

            <details class="answers">
              <summary>Ihre Angaben im Überblick</summary>
              <ol>
                @for (question of questions; track question.id; let i = $index) {
                  <li>
                    <div>
                      <span class="answers__question">{{ question.text }}</span>
                      <span class="answers__answer">{{ selectedOptionTexts(question) }}</span>
                    </div>
                    <button type="button" class="answers__edit" (click)="edit(i)">
                      Ändern<span class="visually-hidden">: {{ question.text }}</span>
                    </button>
                  </li>
                }
              </ol>
            </details>

            <aside class="disclaimer" role="note">{{ disclaimer }}</aside>

            <section class="email-gate" aria-labelledby="email-title">
              <h2 id="email-title">Vollständige Auswertung per E-Mail (optional)</h2>
              <p>
                Ihre vollständige Auswertung mit Pflichten-Checkliste senden wir Ihnen per E-Mail.
                Das Kurzergebnis oben bleibt selbstverständlich ohne Angabe einer E-Mail-Adresse
                sichtbar.
              </p>
              @switch (submitStatus()) {
                @case ('sent') {
                  <p class="success-note" role="status">
                    Fast geschafft: Wir haben Ihnen eine E-Mail geschickt. Bitte bestätigen Sie den
                    Link darin (Double-Opt-in) — erst dann senden wir die Auswertung.
                  </p>
                }
                @default {
                  <form (submit)="submit($event)">
                    <div class="field">
                      <label for="email">E-Mail-Adresse</label>
                      <input
                        id="email"
                        type="email"
                        autocomplete="email"
                        [formControl]="email"
                        [attr.aria-invalid]="email.invalid && email.touched ? true : null"
                        [attr.aria-describedby]="
                          email.invalid && email.touched ? 'email-error' : null
                        "
                      />
                      @if (email.invalid && email.touched) {
                        <p class="field-error" id="email-error">
                          Bitte geben Sie eine gültige E-Mail-Adresse ein.
                        </p>
                      }
                    </div>
                    <div class="field field--checkbox">
                      <input id="consent" type="checkbox" [formControl]="consent" />
                      <label for="consent">
                        Ich willige ein, dass meine E-Mail-Adresse und meine Antworten zur
                        Erstellung und Zusendung der Auswertung verarbeitet werden. Die Einwilligung
                        ist jederzeit widerrufbar — Details in der
                        <a routerLink="/datenschutz">Datenschutzerklärung</a>.
                      </label>
                    </div>
                    @if (consent.invalid && consent.touched) {
                      <p class="field-error">Bitte bestätigen Sie die Einwilligung.</p>
                    }
                    @if (submitStatus() === 'error') {
                      <p class="field-error" role="alert">
                        Senden fehlgeschlagen. Bitte versuchen Sie es später erneut — Ihr
                        Kurzergebnis oben bleibt gültig.
                      </p>
                    }
                    <button type="submit" class="primary" [disabled]="submitStatus() === 'sending'">
                      {{
                        submitStatus() === 'sending' ? 'Wird gesendet …' : 'Auswertung anfordern'
                      }}
                    </button>
                  </form>
                }
              }
            </section>
            <p>
              <button type="button" class="secondary" (click)="restart()">Check neu starten</button>
            </p>
          }
        }
        @default {
          <div class="progress">
            <span class="progress__text" aria-hidden="true">
              Frage {{ questionNumber() }} von {{ questionCount }}
            </span>
            <div class="progress__bar" aria-hidden="true">
              <div
                class="progress__value"
                [style.width.%]="(questionNumber() / questionCount) * 100"
              ></div>
            </div>
            <ol class="steps" aria-label="Fragenübersicht — beantwortete Fragen sind anklickbar">
              @for (question of questions; track question.id; let i = $index) {
                <li>
                  <button
                    type="button"
                    class="dot"
                    [class.dot--active]="i === questionIndex()"
                    [class.dot--answered]="isQuestionAnswered(question.id)"
                    [disabled]="!isQuestionAnswered(question.id) && i !== questionIndex()"
                    [attr.aria-current]="i === questionIndex() ? 'step' : null"
                    [attr.aria-label]="
                      'Frage ' + (i + 1) + (isQuestionAnswered(question.id) ? ' (beantwortet)' : '')
                    "
                    (click)="jumpTo(i)"
                  ></button>
                </li>
              }
            </ol>
          </div>
          @for (question of currentQuestionList(); track question.id) {
            <form
              class="question-card"
              [class.slide--forward]="direction() === 'forward'"
              [class.slide--back]="direction() === 'back'"
              (submit)="next($event)"
            >
              <fieldset>
                <legend>
                  <span class="visually-hidden"
                    >Frage {{ questionNumber() }} von {{ questionCount }}:
                  </span>
                  <span #questionTitle tabindex="-1">{{ question.text }}</span>
                </legend>
                @if (question.hint) {
                  <p class="question-hint">{{ question.hint }}</p>
                }
                <div class="options">
                  @for (option of question.options; track option.id) {
                    <label
                      class="option"
                      [class.option--selected]="isSelected(question.id, option.id)"
                      [for]="question.id + '-' + option.id"
                    >
                      <input
                        class="visually-hidden"
                        [type]="question.type === 'single' ? 'radio' : 'checkbox'"
                        [id]="question.id + '-' + option.id"
                        [name]="question.id"
                        [checked]="isSelected(question.id, option.id)"
                        (change)="select(question, option.id)"
                      />
                      <span
                        class="option__indicator"
                        [class.option__indicator--square]="question.type === 'multi'"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M4 12l5 5L20 6"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span class="option__text">{{ option.text }}</span>
                    </label>
                  }
                </div>
              </fieldset>
              @if (nextAttempted() && !questionAnswered()) {
                <p class="field-error" role="alert">Bitte wählen Sie eine Antwort aus.</p>
              }
              <div class="navigation">
                <button type="button" class="secondary" (click)="back()">Zurück</button>
                <button type="submit" class="primary">
                  {{ nextLabel() }}
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M6 3l5 5-5 5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
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

    .facts {
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

    .benefits {
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

    .progress {
      margin-bottom: var(--space-5);
    }

    .progress__text {
      display: block;
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      font-weight: 600;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      margin-bottom: var(--space-2);
    }

    .progress__bar {
      height: 6px;
      border-radius: 999px;
      background: var(--color-border);
      overflow: hidden;
    }

    .progress__value {
      height: 100%;
      border-radius: 999px;
      background: var(--gradient-tricolor);
      transition: width var(--duration-normal) var(--ease-out);
    }

    .steps {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-3);
    }

    .dot {
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      background: var(--color-bg);
      padding: 0;
      cursor: pointer;
      transition:
        background var(--duration-fast) var(--ease-out),
        border-color var(--duration-fast) var(--ease-out),
        transform var(--duration-fast) var(--ease-out);

      &:disabled {
        cursor: default;
        opacity: 0.55;
      }

      &.dot--answered {
        background: var(--color-accent-line);
        border-color: var(--color-accent);

        &:hover:not(:disabled) {
          transform: scale(1.25);
        }
      }

      &.dot--active {
        background: var(--color-accent);
        border-color: var(--color-accent);
        transform: scale(1.15);
      }
    }

    // Question change: directional card transition
    @keyframes card-forward {
      from {
        opacity: 0;
        transform: translateX(28px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    @keyframes card-back {
      from {
        opacity: 0;
        transform: translateX(-28px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .question-card.slide--forward {
      animation: card-forward var(--duration-normal) var(--ease-out) both;
    }

    .question-card.slide--back {
      animation: card-back var(--duration-normal) var(--ease-out) both;
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

    .question-hint {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      margin-bottom: var(--space-4);
    }

    .options {
      display: grid;
      gap: var(--space-2);
      margin-block: var(--space-4);
    }

    // The whole card is the label; the native input stays (invisible) for
    // keyboard & screen readers. Selection state comes from component state,
    // not from :has() — works in every browser that way.
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
        border-color var(--duration-fast) var(--ease-out),
        background var(--duration-fast) var(--ease-out),
        transform var(--duration-fast) var(--ease-out),
        box-shadow var(--duration-fast) var(--ease-out);

      &:hover {
        border-color: var(--color-border-strong);
        transform: translateX(3px);
        box-shadow: var(--shadow-sm);
      }

      // Keyboard focus of the hidden input made visible on the card
      &:focus-within {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }
    }

    .option--selected {
      border-color: var(--color-accent);
      background: var(--color-accent-faint);
      box-shadow: var(--shadow-sm);

      .option__indicator {
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

    .option__indicator {
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
        border-color var(--duration-fast) var(--ease-out),
        background var(--duration-fast) var(--ease-out);

      svg {
        width: 0.9rem;
        height: 0.9rem;
        opacity: 0;
        transform: scale(0.4);
        transition:
          opacity var(--duration-fast) var(--ease-out),
          transform var(--duration-fast) var(--ease-out);
      }

      &.option__indicator--square {
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

    .traffic-light {
      display: flex;
      gap: var(--space-5);
      align-items: flex-start;
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-block: var(--space-5);
      animation: scale-up var(--duration-slow) var(--ease-out) both;

      h2 {
        margin-bottom: var(--space-3);
        font-size: var(--text-xl);

        &:focus-visible {
          outline: none;
        }
      }
    }

    // Traffic lights: the only "colorful" element (WORKING MAP §7)
    .traffic-light__lights {
      flex-shrink: 0;
      display: grid;
      gap: var(--space-2);
      background: var(--color-text);
      border-radius: 999px;
      padding: var(--space-2);
    }

    .light {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      opacity: 0.22;

      &.light--red {
        background: var(--color-risk-red);
      }

      &.light--yellow {
        background: #e3b341;
      }

      &.light--green {
        background: var(--color-risk-green);
      }
    }

    .traffic-light--red .light--red,
    .traffic-light--yellow .light--yellow,
    .traffic-light--green .light--green {
      opacity: 1;
      box-shadow: 0 0 12px 2px currentColor;
      animation: scale-up var(--duration-slow) var(--ease-out) both;
      animation-delay: 180ms;
    }

    .traffic-light--green {
      background: var(--color-risk-green-bg);
      border-left: 4px solid var(--color-risk-green);
    }

    .traffic-light--yellow {
      background: var(--color-risk-yellow-bg);
      border-left: 4px solid var(--color-risk-yellow);
    }

    .traffic-light--red {
      background: var(--color-risk-red-bg);
      border-left: 4px solid var(--color-risk-red);
    }

    .findings {
      margin: 0;
      padding-left: 1.25rem;

      li + li {
        margin-top: var(--space-2);
      }
    }

    .answers {
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-bg-raised);
      margin-block: var(--space-5);

      summary {
        cursor: pointer;
        font-weight: 600;
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius);
        transition: background var(--duration-fast) var(--ease-out);

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

    .answers__question {
      display: block;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
    }

    .answers__answer {
      display: block;
      font-weight: 600;
    }

    .answers__edit {
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--color-border-strong);
      border-radius: 999px;
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      transition:
        border-color var(--duration-fast) var(--ease-out),
        color var(--duration-fast) var(--ease-out);

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
  protected readonly questions = SCHNELLCHECK.questions;
  protected readonly questionCount = SCHNELLCHECK.questions.length;
  protected readonly trafficLightLabel = TRAFFIC_LIGHT_LABEL;

  protected readonly step = signal<Step>('start');
  protected readonly answers = signal<Answers>({});
  protected readonly nextAttempted = signal(false);
  protected readonly submitStatus = signal<SubmitStatus>('idle');
  protected readonly direction = signal<Direction>('forward');
  private readonly cameFromResult = signal(false);

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly consent = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });

  private readonly questionTitle = viewChild<ElementRef<HTMLElement>>('questionTitle');
  private readonly resultTitle = viewChild<ElementRef<HTMLElement>>('resultTitle');

  protected readonly questionIndex = computed(() => {
    const step = this.step();
    return typeof step === 'number' ? step : -1;
  });

  protected readonly currentQuestion = computed<Question | undefined>(
    () => SCHNELLCHECK.questions[this.questionIndex()],
  );

  /** As a one-element list so @for rebuilds the card per question (animation). */
  protected readonly currentQuestionList = computed<readonly Question[]>(() => {
    const question = this.currentQuestion();
    return question ? [question] : [];
  });

  protected readonly questionNumber = computed(() => this.questionIndex() + 1);

  protected readonly questionAnswered = computed(() => {
    const question = this.currentQuestion();
    return !!question && (this.answers()[question.id]?.length ?? 0) > 0;
  });

  protected readonly nextLabel = computed(() => {
    if (this.cameFromResult()) {
      return 'Zurück zum Ergebnis';
    }
    return this.questionNumber() === this.questionCount ? 'Zum Ergebnis' : 'Weiter';
  });

  protected readonly result = computed(() =>
    this.step() === 'result' && isComplete(SCHNELLCHECK, this.answers())
      ? evaluate(SCHNELLCHECK, this.answers())
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

  protected start(): void {
    this.direction.set('forward');
    this.step.set(0);
    this.focusQuestion();
  }

  protected isQuestionAnswered(questionId: string): boolean {
    return (this.answers()[questionId]?.length ?? 0) > 0;
  }

  protected jumpTo(index: number): void {
    const current = this.questionIndex();
    if (index === current) {
      return;
    }
    this.direction.set(index > current ? 'forward' : 'back');
    this.nextAttempted.set(false);
    this.step.set(index);
    this.focusQuestion();
  }

  /** Change an answer from the result overview. */
  protected edit(index: number): void {
    this.cameFromResult.set(true);
    this.direction.set('back');
    this.step.set(index);
    this.focusQuestion();
  }

  protected selectedOptionTexts(question: Question): string {
    const selection = this.answers()[question.id] ?? [];
    return question.options
      .filter((option) => selection.includes(option.id))
      .map((option) => option.text)
      .join(', ');
  }

  protected select(question: Question, optionId: string): void {
    this.answers.update((answers) => {
      const previous = answers[question.id] ?? [];
      const selection =
        question.type === 'single'
          ? [optionId]
          : previous.includes(optionId)
            ? previous.filter((id) => id !== optionId)
            : [...previous, optionId];
      return { ...answers, [question.id]: selection };
    });
  }

  protected isSelected(questionId: string, optionId: string): boolean {
    return this.answers()[questionId]?.includes(optionId) ?? false;
  }

  protected next(event: Event): void {
    event.preventDefault();
    if (!this.questionAnswered()) {
      this.nextAttempted.set(true);
      return;
    }
    this.nextAttempted.set(false);
    const index = this.questionIndex();
    if (index < 0) {
      return;
    }
    if (this.cameFromResult() && isComplete(SCHNELLCHECK, this.answers())) {
      this.cameFromResult.set(false);
      this.showResult();
      return;
    }
    if (index + 1 < this.questionCount) {
      this.direction.set('forward');
      this.step.set(index + 1);
      this.focusQuestion();
    } else {
      this.showResult();
    }
  }

  protected back(): void {
    const index = this.questionIndex();
    this.nextAttempted.set(false);
    this.cameFromResult.set(false);
    this.direction.set('back');
    if (index === 0) {
      this.step.set('start');
    } else if (index > 0) {
      this.step.set(index - 1);
      this.focusQuestion();
    }
  }

  protected restart(): void {
    this.answers.set({});
    this.submitStatus.set('idle');
    this.cameFromResult.set(false);
    this.email.reset();
    this.consent.reset();
    this.direction.set('forward');
    this.step.set('start');
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.email.markAsTouched();
    this.consent.markAsTouched();
    const result = this.result();
    if (this.email.invalid || this.consent.invalid || !result) {
      return;
    }
    this.submitStatus.set('sending');
    this.api
      .submitResult({
        email: this.email.value,
        consent: true,
        answers: this.answers(),
      })
      .subscribe({
        next: () => this.submitStatus.set('sent'),
        error: () => this.submitStatus.set('error'),
      });
  }

  private showResult(): void {
    this.step.set('result');
    queueMicrotask(() => this.resultTitle()?.nativeElement.focus());
  }

  private focusQuestion(): void {
    queueMicrotask(() => this.questionTitle()?.nativeElement.focus());
  }
}
