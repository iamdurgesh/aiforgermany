import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="container site-header__inner">
        <a routerLink="/" class="site-header__logo-link">
          <img
            src="/assets/afg-logo-header.png"
            alt="AI for Germany — zur Startseite"
            width="118"
            height="56"
            class="site-header__logo"
          />
        </a>
        <nav aria-label="Hauptnavigation">
          <ul class="site-header__nav">
            @for (item of navItems; track item.path) {
              <li>
                <a
                  [routerLink]="item.path"
                  routerLinkActive="is-active"
                  ariaCurrentWhenActive="page"
                  >{{ item.label }}</a
                >
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: `
    .site-header {
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .site-header__inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3) var(--space-5);
      padding-block: var(--space-3);
    }

    .site-header__logo {
      display: block;
      width: auto;
      height: 3.5rem;
    }

    .site-header__nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-5);
      list-style: none;

      a {
        color: var(--color-text);
        text-decoration: none;
        font-weight: 500;
        padding-block: var(--space-1);

        &:hover {
          color: var(--color-accent);
        }

        &.is-active {
          color: var(--color-accent);
          box-shadow: 0 2px 0 0 var(--color-accent);
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly navItems = [
    { path: '/artikel', label: 'Artikel' },
    { path: '/schnellcheck', label: 'Schnellcheck' },
    { path: '/glossar', label: 'Glossar' },
    { path: '/newsletter', label: 'Newsletter' },
  ] as const;
}
