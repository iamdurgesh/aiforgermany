import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { ARTIKEL } from './artikel.generated';

@Component({
  selector: 'app-artikel-index',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <p class="kicker einblenden" style="--reihenfolge: 0">Fachbeiträge</p>
      <h1 class="einblenden" style="--reihenfolge: 1">Artikel</h1>
      <p class="einblenden intro" style="--reihenfolge: 2">
        Fachbeiträge zu KI-Einsatz und KI-Regulierung im deutschen Mittelstand — nüchtern,
        präzise, praxisnah.
      </p>
      <ul class="artikel-liste">
        @for (artikel of alleArtikel; track artikel.slug) {
          <li class="scroll-reveal">
            <article>
              <a class="eintrag" [routerLink]="['/artikel', artikel.slug]">
                <time [dateTime]="artikel.date">{{ artikel.date | date: 'd. MMMM yyyy' }}</time>
                <h2>{{ artikel.title }}</h2>
                <p>{{ artikel.description }}</p>
                <span class="eintrag__mehr" aria-hidden="true">Weiterlesen →</span>
              </a>
            </article>
          </li>
        }
      </ul>
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

    h1 {
      margin-bottom: var(--space-3);
    }

    .intro {
      color: var(--color-text-muted);
      margin-bottom: var(--space-6);
    }

    .artikel-liste {
      list-style: none;
      padding: 0;
      display: grid;
    }

    .eintrag {
      display: block;
      border-top: 1px solid var(--color-border);
      padding: var(--space-5) var(--space-3);
      margin-inline: calc(-1 * var(--space-3));
      border-radius: var(--radius);
      color: inherit;
      text-decoration: none;
      transition: background var(--dauer-schnell) var(--ease-out);

      &:hover {
        background: var(--color-accent-faint);

        h2 {
          color: var(--color-accent);
        }

        .eintrag__mehr {
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

      h2 {
        margin: var(--space-2) 0;
        font-size: var(--text-xl);
        transition: color var(--dauer-schnell) var(--ease-out);
      }

      p {
        margin: 0 0 var(--space-2);
        color: var(--color-text-muted);
      }
    }

    .eintrag__mehr {
      display: inline-block;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-faint);
      transition:
        color var(--dauer-schnell) var(--ease-out),
        transform var(--dauer-schnell) var(--ease-out);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelIndexComponent {
  protected readonly alleArtikel = ARTIKEL;

  constructor() {
    inject(PageMetaService).setPage({
      title: 'Artikel — AI for Germany',
      description:
        'Fachbeiträge zu EU AI Act, Schatten-KI, KI-Inventar und KI-Richtlinien für den deutschen Mittelstand.',
      path: '/artikel',
    });
  }
}
