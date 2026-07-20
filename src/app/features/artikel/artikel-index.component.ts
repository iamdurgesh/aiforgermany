import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { ARTICLES } from './artikel.generated';

@Component({
  selector: 'app-artikel-index',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page">
      <p class="kicker fade-in" style="--stagger: 0">Fachbeiträge</p>
      <h1 class="fade-in" style="--stagger: 1">Artikel</h1>
      <p class="fade-in intro" style="--stagger: 2">
        Fachbeiträge zu KI-Einsatz und KI-Regulierung im deutschen Mittelstand — nüchtern,
        präzise, praxisnah.
      </p>
      <ul class="article-list">
        @for (article of allArticles; track article.slug) {
          <li class="scroll-reveal">
            <article>
              <a class="entry" [routerLink]="['/artikel', article.slug]">
                <time [dateTime]="article.date">{{ article.date | date: 'd. MMMM yyyy' }}</time>
                <h2>{{ article.title }}</h2>
                <p>{{ article.description }}</p>
                <span class="entry__more" aria-hidden="true">Weiterlesen →</span>
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

    .article-list {
      list-style: none;
      padding: 0;
      display: grid;
    }

    .entry {
      display: block;
      border-top: 1px solid var(--color-border);
      padding: var(--space-5) var(--space-3);
      margin-inline: calc(-1 * var(--space-3));
      border-radius: var(--radius);
      color: inherit;
      text-decoration: none;
      transition: background var(--duration-fast) var(--ease-out);

      &:hover {
        background: var(--color-accent-faint);

        h2 {
          color: var(--color-accent);
        }

        .entry__more {
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
        transition: color var(--duration-fast) var(--ease-out);
      }

      p {
        margin: 0 0 var(--space-2);
        color: var(--color-text-muted);
      }
    }

    .entry__more {
      display: inline-block;
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-faint);
      transition:
        color var(--duration-fast) var(--ease-out),
        transform var(--duration-fast) var(--ease-out);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelIndexComponent {
  protected readonly allArticles = ARTICLES;

  constructor() {
    inject(PageMetaService).setPage({
      title: 'Artikel — AI for Germany',
      description:
        'Fachbeiträge zu EU AI Act, Schatten-KI, KI-Inventar und KI-Richtlinien für den deutschen Mittelstand.',
      path: '/artikel',
    });
  }
}
