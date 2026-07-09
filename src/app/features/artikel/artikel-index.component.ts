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
      <h1>Artikel</h1>
      <p>
        Fachbeiträge zu KI-Einsatz und KI-Regulierung im deutschen Mittelstand — nüchtern,
        präzise, praxisnah.
      </p>
      <ul class="artikel-liste">
        @for (artikel of alleArtikel; track artikel.slug) {
          <li>
            <article>
              <time [dateTime]="artikel.date">{{ artikel.date | date: 'd. MMMM yyyy' }}</time>
              <h2><a [routerLink]="['/artikel', artikel.slug]">{{ artikel.title }}</a></h2>
              <p>{{ artikel.description }}</p>
            </article>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .artikel-liste {
      list-style: none;
      padding: 0;
      display: grid;
      gap: var(--space-5);

      li {
        border-top: 1px solid var(--color-border);
        padding-top: var(--space-5);
      }

      time {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }

      h2 {
        margin: var(--space-1) 0 var(--space-2);
        font-size: var(--text-xl);

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: var(--color-accent);
            text-decoration: underline;
          }
        }
      }

      p {
        margin: 0;
        color: var(--color-text-muted);
      }
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
