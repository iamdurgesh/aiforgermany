import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { ARTIKEL } from '../artikel/artikel.generated';
import { SCHNELLCHECK } from '../schnellcheck/schnellcheck.definition';
import { NewsletterSignupComponent } from '../../shared/newsletter-signup.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, NewsletterSignupComponent],
  template: `
    <section class="hero">
      <!-- dezentes Knoten-Raster als Hintergrund, rein dekorativ -->
      <svg class="hero__grafik" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
        <g fill="none" stroke="#14181d" stroke-width="1.2" opacity="0.35">
          <path d="M80 320 L200 220 L360 260 L520 120" />
          <path d="M200 220 L300 90 L520 120" />
          <path d="M80 320 L300 90" opacity="0.5" />
          <path d="M360 260 L300 90" opacity="0.5" />
        </g>
        <g>
          <circle cx="80" cy="320" r="5" fill="#14181d" />
          <circle cx="200" cy="220" r="7" fill="#bf3427" />
          <circle cx="300" cy="90" r="9" fill="#f2b12e" />
          <circle cx="360" cy="260" r="6" fill="#bf3427" />
          <circle cx="520" cy="120" r="7" fill="#14181d" />
        </g>
      </svg>
      <div class="container hero__inner">
        <p class="hero__kicker einblenden" style="--reihenfolge: 0">
          Unabhängiges Fachportal · EU AI Act · Mittelstand
        </p>
        <h1 class="hero__titel einblenden" style="--reihenfolge: 1">
          KI-Einsatz und KI&#8209;Regulierung —
          <span class="hero__akzent">verständlich erklärt</span>
        </h1>
        <p class="hero__mission einblenden" style="--reihenfolge: 2">
          Für IT-Leitung, Datenschutzbeauftragte und Geschäftsführung: Was verlangt der EU AI
          Act, welche Fristen gelten, und was ist im Unternehmen konkret zu tun?
        </p>
        <div class="hero__aktionen einblenden" style="--reihenfolge: 3">
          <a class="primaer" routerLink="/schnellcheck">
            Schnellcheck starten
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
          </a>
          <a class="sekundaer" routerLink="/artikel">Artikel lesen</a>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="teaser scroll-reveal" aria-labelledby="teaser-titel">
        <div class="teaser__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8.5 8.5l1.5 1.5 3-3.5" />
            <path d="M8.5 14.5l1.5 1.5 3-3.5" />
          </svg>
        </div>
        <div>
          <h2 id="teaser-titel">Wo steht Ihr Unternehmen? Der KI-Act Schnellcheck</h2>
          <p>
            {{ anzahlFragen }} Fragen, etwa 3 Minuten: eine erste, unverbindliche Orientierung,
            welche Pflichten des EU AI Act Ihr Unternehmen voraussichtlich betreffen — ohne
            Anmeldung, Ergebnis sofort sichtbar.
          </p>
          <a class="teaser__link" routerLink="/schnellcheck">
            Jetzt einschätzen <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section aria-labelledby="artikel-titel" class="artikel-bereich">
        <div class="artikel-bereich__kopf scroll-reveal">
          <h2 id="artikel-titel">Aktuelle Artikel</h2>
          <a routerLink="/artikel" class="alle-link">Alle Artikel <span aria-hidden="true">→</span></a>
        </div>
        <ul class="artikel-karten">
          @for (artikel of neuesteArtikel; track artikel.slug; let i = $index) {
            <li class="scroll-reveal">
              <article>
                <a class="karte" [routerLink]="['/artikel', artikel.slug]">
                  <time [dateTime]="artikel.date">{{ artikel.date | date: 'd. MMMM yyyy' }}</time>
                  <h3>{{ artikel.title }}</h3>
                  <p>{{ artikel.description }}</p>
                  <span class="karte__mehr" aria-hidden="true">Weiterlesen →</span>
                </a>
              </article>
            </li>
          }
        </ul>
      </section>

      <section class="newsletter-box scroll-reveal" aria-labelledby="newsletter-titel">
        <h2 id="newsletter-titel">KI-Regulierung in 5 Minuten — monatlich</h2>
        <p>
          Das Wichtigste zu Fristen, Pflichten und KI-Praxis im Mittelstand, einmal im Monat per
          E-Mail. Double-Opt-in, jederzeit abbestellbar.
        </p>
        <app-newsletter-signup />
      </section>
    </div>
  `,
  styles: `
    .hero {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(70rem 26rem at 88% -10%, var(--color-gold-subtle) 0%, transparent 60%),
        radial-gradient(50rem 22rem at 0% 110%, var(--color-accent-faint) 0%, transparent 55%),
        linear-gradient(180deg, var(--color-bg-subtle) 0%, var(--color-bg) 92%);

      // Trikolore-Linie (Markenmotiv)
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: var(--verlauf-trikolore);
      }
    }

    .hero__grafik {
      position: absolute;
      right: -4rem;
      top: 50%;
      transform: translateY(-50%);
      width: min(46rem, 70vw);
      opacity: 0.16;
      pointer-events: none;
    }

    .hero__inner {
      position: relative;
      padding-block: clamp(var(--space-7), 9vw, var(--space-9));
      max-width: none;
    }

    .hero__kicker {
      font-size: var(--text-xs);
      font-weight: 650;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-gold-dark);
      margin-bottom: var(--space-4);
    }

    .hero__titel {
      font-size: var(--text-display);
      max-width: 17ch;
      margin-bottom: var(--space-5);
    }

    .hero__akzent {
      background: linear-gradient(120deg, var(--color-accent-bright), var(--color-accent-dark));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero__mission {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      max-width: 44rem;
      margin-bottom: var(--space-6);
    }

    .hero__aktionen {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .teaser {
      display: flex;
      gap: var(--space-5);
      align-items: flex-start;
      border: 1px solid var(--color-accent-line);
      background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-accent-faint) 100%);
      border-radius: var(--radius-lg);
      padding: clamp(var(--space-5), 4vw, var(--space-6));
      margin-block: var(--space-8);
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--dauer-normal) var(--ease-out);

      &:hover {
        box-shadow: var(--shadow-md);
      }

      h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-3);
      }

      p {
        margin-bottom: var(--space-4);
        color: var(--color-text-muted);
        max-width: 44rem;
      }
    }

    .teaser__icon {
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--radius);
      background: var(--color-accent-subtle);
      color: var(--color-accent);
    }

    .teaser__link {
      font-weight: 600;
      text-decoration: none;

      span {
        display: inline-block;
        transition: transform var(--dauer-schnell) var(--ease-out);
      }

      &:hover span {
        transform: translateX(4px);
      }
    }

    .artikel-bereich {
      margin-block-end: var(--space-8);
    }

    .artikel-bereich__kopf {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    .alle-link {
      font-weight: 600;
      font-size: var(--text-sm);
      text-decoration: none;
      white-space: nowrap;

      span {
        display: inline-block;
        transition: transform var(--dauer-schnell) var(--ease-out);
      }

      &:hover span {
        transform: translateX(4px);
      }
    }

    .artikel-karten {
      list-style: none;
      padding: 0;
      display: grid;
      gap: var(--space-5);
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    }

    .karte {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      height: 100%;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      background: var(--color-bg-raised);
      color: inherit;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      transition:
        transform var(--dauer-normal) var(--ease-out),
        box-shadow var(--dauer-normal) var(--ease-out),
        border-color var(--dauer-normal) var(--ease-out);

      // Akzentkante, faehrt bei Hover ein
      &::before {
        content: '';
        position: absolute;
        inset: 0 auto 0 0;
        width: 3px;
        background: linear-gradient(180deg, var(--color-accent-bright), var(--color-accent));
        transform: scaleY(0);
        transform-origin: top;
        transition: transform var(--dauer-normal) var(--ease-out);
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-accent-line);

        &::before {
          transform: scaleY(1);
        }

        .karte__mehr {
          color: var(--color-accent);
          transform: translateX(4px);
        }
      }

      time {
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: var(--tracking-wide);
        text-transform: uppercase;
        color: var(--color-text-faint);
      }

      h3 {
        font-size: var(--text-lg);
      }

      p {
        color: var(--color-text-muted);
        font-size: var(--text-sm);
        margin: 0;
        flex: 1;
      }
    }

    .karte__mehr {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-faint);
      transition:
        color var(--dauer-schnell) var(--ease-out),
        transform var(--dauer-schnell) var(--ease-out);
    }

    .newsletter-box {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(40rem 16rem at 110% 120%, var(--color-accent-subtle) 0%, transparent 65%),
        var(--color-bg-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: clamp(var(--space-5), 4vw, var(--space-7));
      margin-block-end: var(--space-8);
      max-width: 46rem;

      h2 {
        font-size: var(--text-xl);
        margin-bottom: var(--space-3);
      }

      > p {
        color: var(--color-text-muted);
        max-width: 40rem;
      }
    }

    @media (max-width: 40rem) {
      .teaser {
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly neuesteArtikel = ARTIKEL.slice(0, 3);
  protected readonly anzahlFragen = SCHNELLCHECK.fragen.length;

  constructor() {
    inject(PageMetaService).setPage({
      title: 'AI for Germany — KI-Einsatz und KI-Regulierung im Mittelstand',
      description:
        'Das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im deutschen Mittelstand: Artikel, Glossar und KI-Act Schnellcheck.',
      path: '/',
    });
  }
}
