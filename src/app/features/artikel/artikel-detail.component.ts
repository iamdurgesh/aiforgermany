import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { SITE_URL } from '../../core/site';
import { ARTIKEL } from './artikel.generated';

@Component({
  selector: 'app-artikel-detail',
  imports: [RouterLink, DatePipe],
  template: `
    @if (artikel(); as a) {
      <article class="page einblenden">
        <header>
          <time [dateTime]="a.date">{{ a.date | date: 'd. MMMM yyyy' }}</time>
          <h1>{{ a.title }}</h1>
          <p class="autor">Redaktion AI for Germany</p>
          <ul class="schlagworte" aria-label="Schlagworte">
            @for (wort of a.keywords; track wort) {
              <li>{{ wort }}</li>
            }
          </ul>
        </header>
        <div [innerHTML]="a.html"></div>
        <footer class="artikel-fusszeile">
          <a routerLink="/artikel" class="zurueck">← Alle Artikel</a>
        </footer>
      </article>
    } @else {
      <div class="page">
        <h1>Artikel nicht gefunden</h1>
        <p>Der aufgerufene Beitrag existiert nicht oder wurde verschoben.</p>
        <ul>
          <li><a routerLink="/artikel">Zur Artikelübersicht</a></li>
          <li><a routerLink="/schnellcheck">Zum KI-Act Schnellcheck</a></li>
          <li><a routerLink="/">Zur Startseite</a></li>
        </ul>
      </div>
    }
  `,
  styles: `
    header {
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-5);
      border-bottom: 1px solid var(--color-border);

      time {
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: var(--tracking-wide);
        text-transform: uppercase;
        color: var(--color-accent);
      }

      h1 {
        margin: var(--space-2) 0;
      }
    }

    .autor {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      margin: 0 0 var(--space-3);
    }

    .schlagworte {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);

      li {
        font-size: var(--text-xs);
        font-weight: 550;
        color: var(--color-accent);
        background: var(--color-accent-subtle);
        border: 1px solid var(--color-accent-line);
        border-radius: 999px;
        padding: 0.1rem var(--space-3);
      }

      li + li {
        margin: 0;
      }
    }

    .artikel-fusszeile {
      margin-top: var(--space-7);
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-4);
    }

    .zurueck {
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelDetailComponent implements OnDestroy {
  readonly slug = input.required<string>();

  private readonly pageMeta = inject(PageMetaService);

  protected readonly artikel = computed(() => ARTIKEL.find((a) => a.slug === this.slug()));

  constructor() {
    effect(() => {
      const a = this.artikel();
      if (!a) {
        return;
      }
      this.pageMeta.setPage({
        title: `${a.title} — AI for Germany`,
        description: a.description,
        path: `/artikel/${a.slug}`,
        ogType: 'article',
      });
      this.pageMeta.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        datePublished: a.date,
        inLanguage: 'de',
        keywords: a.keywords.join(', '),
        author: { '@type': 'Organization', name: 'Redaktion AI for Germany' },
        publisher: { '@type': 'Organization', name: 'AI for Germany', url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/artikel/${a.slug}`,
      });
    });
  }

  ngOnDestroy(): void {
    this.pageMeta.removeJsonLd();
  }
}
