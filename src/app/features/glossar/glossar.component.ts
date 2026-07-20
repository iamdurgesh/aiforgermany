import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { GLOSSARY } from './glossar.data';

@Component({
  selector: 'app-glossar',
  imports: [RouterLink],
  template: `
    <div class="page">
      <p class="kicker fade-in" style="--stagger: 0">Nachschlagewerk</p>
      <h1 class="fade-in" style="--stagger: 1">Glossar</h1>
      <p class="fade-in intro" style="--stagger: 2">
        Die wichtigsten Begriffe rund um EU AI Act, KI-Einsatz und KI-Aufsicht in Deutschland —
        kompakt und ohne Juristendeutsch. Für eine erste Einschätzung Ihres Unternehmens:
        <a routerLink="/schnellcheck">zum KI-Act Schnellcheck</a>.
      </p>

      <div class="field search fade-in" style="--stagger: 3">
        <label for="glossary-search">Begriff suchen</label>
        <input
          id="glossary-search"
          type="text"
          autocomplete="off"
          placeholder="z. B. Hochrisiko, Anhang III, Schatten-KI …"
          (input)="filter.set(searchInput($event))"
        />
        <p class="search__status" role="status">
          @if (filter()) {
            {{ filtered().length }} von {{ allTerms.length }} Begriffen
          } @else {
            {{ allTerms.length }} Begriffe, alphabetisch sortiert
          }
        </p>
      </div>

      <dl class="glossary">
        @for (entry of filtered(); track entry.id) {
          <div class="glossary__entry" [id]="entry.id">
            <dt>
              <a class="glossary__anchor" [href]="'/glossar#' + entry.id" aria-hidden="true"
                >#</a
              >
              {{ entry.term }}
            </dt>
            <dd>
              {{ entry.definition }}
              @if (entry.links?.length) {
                <span class="references">
                  <span class="references__label">Mehr dazu:</span>
                  @for (link of entry.links; track link.path) {
                    <a [routerLink]="link.path">{{ link.text }}</a>
                  }
                </span>
              }
            </dd>
          </div>
        } @empty {
          <p class="empty">
            Kein Treffer für „{{ filter() }}“. Vielleicht hilft die
            <a routerLink="/artikel">Artikelübersicht</a> weiter.
          </p>
        }
      </dl>
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
    }

    .search {
      margin-block: var(--space-5) var(--space-2);

      input {
        max-width: 28rem;
      }
    }

    .search__status {
      color: var(--color-text-faint);
      font-size: var(--text-xs);
      margin-top: var(--space-2);
    }

    .glossary {
      display: grid;
      margin-top: var(--space-4);
    }

    .glossary__entry {
      border-top: 1px solid var(--color-border);
      padding: var(--space-4) var(--space-3);
      margin-inline: calc(-1 * var(--space-3));
      border-radius: var(--radius);
      scroll-margin-top: 6rem;
      transition: background var(--duration-fast) var(--ease-out);

      &:hover {
        background: var(--color-accent-faint);
      }

      &:target {
        background: var(--color-accent-subtle);
      }
    }

    dt {
      font-weight: 680;
      font-size: var(--text-lg);
      letter-spacing: var(--tracking-tight);
      margin-bottom: var(--space-2);
    }

    dd {
      margin: 0;
      color: var(--color-text-muted);
    }

    .references {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-3);
      align-items: baseline;
      margin-top: var(--space-3);
      font-size: var(--text-sm);

      a {
        font-weight: 550;
        text-decoration: none;
        border: 1px solid var(--color-accent-line);
        background: var(--color-accent-faint);
        border-radius: 999px;
        padding: var(--space-1) var(--space-3);
        transition:
          border-color var(--duration-fast) var(--ease-out),
          background var(--duration-fast) var(--ease-out);

        &:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-subtle);
        }
      }
    }

    .references__label {
      font-size: var(--text-xs);
      font-weight: 650;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-text-faint);
    }

    .glossary__anchor {
      color: var(--color-border-strong);
      text-decoration: none;
      margin-right: var(--space-1);
      transition: color var(--duration-fast) var(--ease-out);

      &:hover,
      &:focus-visible {
        color: var(--color-accent);
      }
    }

    .empty {
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-4);
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlossarComponent {
  protected readonly allTerms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'de'));

  protected readonly filter = signal('');

  protected readonly filtered = computed(() => {
    const searchTerm = this.filter().trim().toLowerCase();
    if (!searchTerm) {
      return this.allTerms;
    }
    return this.allTerms.filter(
      (entry) =>
        entry.term.toLowerCase().includes(searchTerm) ||
        entry.definition.toLowerCase().includes(searchTerm),
    );
  });

  constructor() {
    inject(PageMetaService).setPage({
      title: 'Glossar — AI for Germany',
      description:
        'Von Anhang III bis Schatten-KI: die wichtigsten Begriffe zu EU AI Act und KI-Einsatz im Mittelstand, kompakt erklärt.',
      path: '/glossar',
    });
  }

  protected searchInput(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
