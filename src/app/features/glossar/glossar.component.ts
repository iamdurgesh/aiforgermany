import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageMetaService } from '../../core/page-meta.service';
import { GLOSSAR } from './glossar.data';

@Component({
  selector: 'app-glossar',
  imports: [RouterLink],
  template: `
    <div class="page">
      <p class="kicker einblenden" style="--reihenfolge: 0">Nachschlagewerk</p>
      <h1 class="einblenden" style="--reihenfolge: 1">Glossar</h1>
      <p class="einblenden intro" style="--reihenfolge: 2">
        Die wichtigsten Begriffe rund um EU AI Act, KI-Einsatz und KI-Aufsicht in Deutschland —
        kompakt und ohne Juristendeutsch. Für eine erste Einschätzung Ihres Unternehmens:
        <a routerLink="/schnellcheck">zum KI-Act Schnellcheck</a>.
      </p>

      <div class="feld suche einblenden" style="--reihenfolge: 3">
        <label for="glossar-suche">Begriff suchen</label>
        <input
          id="glossar-suche"
          type="text"
          autocomplete="off"
          placeholder="z. B. Hochrisiko, Anhang III, Schatten-KI …"
          (input)="filter.set(sucheingabe($event))"
        />
        <p class="suche__stand" role="status">
          @if (filter()) {
            {{ gefiltert().length }} von {{ alle.length }} Begriffen
          } @else {
            {{ alle.length }} Begriffe, alphabetisch sortiert
          }
        </p>
      </div>

      <dl class="glossar">
        @for (eintrag of gefiltert(); track eintrag.id) {
          <div class="glossar__eintrag" [id]="eintrag.id">
            <dt>
              <a class="glossar__anker" [href]="'/glossar#' + eintrag.id" aria-hidden="true"
                >#</a
              >
              {{ eintrag.begriff }}
            </dt>
            <dd>
              {{ eintrag.definition }}
              @if (eintrag.verweise?.length) {
                <span class="verweise">
                  <span class="verweise__label">Mehr dazu:</span>
                  @for (verweis of eintrag.verweise; track verweis.pfad) {
                    <a [routerLink]="verweis.pfad">{{ verweis.text }}</a>
                  }
                </span>
              }
            </dd>
          </div>
        } @empty {
          <p class="leer">
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

    .suche {
      margin-block: var(--space-5) var(--space-2);

      input {
        max-width: 28rem;
      }
    }

    .suche__stand {
      color: var(--color-text-faint);
      font-size: var(--text-xs);
      margin-top: var(--space-2);
    }

    .glossar {
      display: grid;
      margin-top: var(--space-4);
    }

    .glossar__eintrag {
      border-top: 1px solid var(--color-border);
      padding: var(--space-4) var(--space-3);
      margin-inline: calc(-1 * var(--space-3));
      border-radius: var(--radius);
      scroll-margin-top: 6rem;
      transition: background var(--dauer-schnell) var(--ease-out);

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

    .verweise {
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
          border-color var(--dauer-schnell) var(--ease-out),
          background var(--dauer-schnell) var(--ease-out);

        &:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-subtle);
        }
      }
    }

    .verweise__label {
      font-size: var(--text-xs);
      font-weight: 650;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-text-faint);
    }

    .glossar__anker {
      color: var(--color-border-strong);
      text-decoration: none;
      margin-right: var(--space-1);
      transition: color var(--dauer-schnell) var(--ease-out);

      &:hover,
      &:focus-visible {
        color: var(--color-accent);
      }
    }

    .leer {
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-4);
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlossarComponent {
  protected readonly alle = [...GLOSSAR].sort((a, b) => a.begriff.localeCompare(b.begriff, 'de'));

  protected readonly filter = signal('');

  protected readonly gefiltert = computed(() => {
    const suchwort = this.filter().trim().toLowerCase();
    if (!suchwort) {
      return this.alle;
    }
    return this.alle.filter(
      (eintrag) =>
        eintrag.begriff.toLowerCase().includes(suchwort) ||
        eintrag.definition.toLowerCase().includes(suchwort),
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

  protected sucheingabe(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
