import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div class="site-footer__spalte site-footer__mission">
          <p class="site-footer__marke">AI for Germany</p>
          <p>
            Das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im deutschen
            Mittelstand.
          </p>
          <!-- PRODUKT-LINK folgt -->
        </div>
        <nav class="site-footer__spalte" aria-label="Portal">
          <p class="site-footer__titel">Portal</p>
          <ul>
            <li><a routerLink="/artikel">Artikel</a></li>
            <li><a routerLink="/schnellcheck">KI-Act Schnellcheck</a></li>
            <li><a routerLink="/glossar">Glossar</a></li>
            <li><a routerLink="/newsletter">Newsletter</a></li>
          </ul>
        </nav>
        <nav class="site-footer__spalte" aria-label="Rechtliches">
          <p class="site-footer__titel">Rechtliches</p>
          <ul>
            <li><a routerLink="/impressum">Impressum</a></li>
            <li><a routerLink="/datenschutz">Datenschutz</a></li>
            <li><a routerLink="/ueber">Über das Portal</a></li>
          </ul>
        </nav>
      </div>
      <div class="container site-footer__meta">
        <p>© {{ year }} AI for Germany · Ohne Tracker, ohne Cookies, ohne Drittanbieter.</p>
      </div>
    </footer>
  `,
  styles: `
    .site-footer {
      margin-top: var(--space-9);
      background: linear-gradient(180deg, var(--color-bg-subtle) 0%, var(--color-accent-faint) 100%);
      border-top: 1px solid var(--color-border);
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      position: relative;

      // Trikolore-Linie (Markenmotiv)
      &::before {
        content: '';
        position: absolute;
        top: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--verlauf-trikolore);
      }
    }

    .site-footer__inner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
      gap: var(--space-6);
      padding-block: var(--space-7) var(--space-5);
    }

    .site-footer__marke {
      font-weight: 680;
      color: var(--color-text);
      letter-spacing: var(--tracking-tight);
      font-size: var(--text-lg);
      margin-bottom: var(--space-2);
    }

    .site-footer__mission p {
      max-width: 26rem;
    }

    .site-footer__titel {
      font-weight: 650;
      color: var(--color-text);
      text-transform: uppercase;
      font-size: var(--text-xs);
      letter-spacing: var(--tracking-wide);
      margin-bottom: var(--space-3);
    }

    .site-footer__spalte ul {
      list-style: none;
      display: grid;
      gap: var(--space-2);

      a {
        color: var(--color-text-muted);
        text-decoration: none;

        &:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }
      }
    }

    .site-footer__meta {
      border-top: 1px solid var(--color-border);
      padding-block: var(--space-4);
      color: var(--color-text-faint);
      font-size: var(--text-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
