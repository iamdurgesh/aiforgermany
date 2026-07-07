import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <p class="site-footer__mission">
          AI for Germany — das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im
          deutschen Mittelstand.
        </p>
        <!-- PRODUKT-LINK folgt -->
        <nav aria-label="Rechtliches und Portal">
          <ul class="site-footer__nav">
            <li><a routerLink="/impressum">Impressum</a></li>
            <li><a routerLink="/datenschutz">Datenschutz</a></li>
            <li><a routerLink="/ueber">Über das Portal</a></li>
          </ul>
        </nav>
        <p class="site-footer__copyright">© {{ year }} AI for Germany</p>
      </div>
    </footer>
  `,
  styles: `
    .site-footer {
      margin-top: var(--space-8);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-subtle);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }

    .site-footer__inner {
      display: grid;
      gap: var(--space-4);
      padding-block: var(--space-6);
    }

    .site-footer__mission {
      max-width: var(--width-prose);
    }

    .site-footer__nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-5);
      list-style: none;

      a {
        color: var(--color-text);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
