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
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid var(--color-border);
      background: rgb(255 255 255 / 0.86);
      backdrop-filter: blur(10px) saturate(1.4);
      -webkit-backdrop-filter: blur(10px) saturate(1.4);

      // Tricolor line (brand motif)
      &::before {
        content: '';
        display: block;
        height: 3px;
        background: var(--gradient-tricolor);
      }
    }

    .site-header__inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3) var(--space-5);
      padding-block: var(--space-2);
    }

    .site-header__logo-link {
      display: block;
      transition: transform var(--duration-fast) var(--ease-out);

      &:hover {
        transform: scale(1.03);
      }
    }

    .site-header__logo {
      display: block;
      width: auto;
      height: 4.75rem;
    }

    .site-header__nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-5);
      list-style: none;

      a {
        position: relative;
        color: var(--color-text);
        text-decoration: none;
        font-weight: 550;
        font-size: var(--text-sm);
        letter-spacing: 0.01em;
        padding-block: var(--space-2);
        transition: color var(--duration-fast) var(--ease-out);

        // animated underline
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 100%;
          bottom: 0;
          height: 2px;
          background: var(--color-accent);
          border-radius: 2px;
          transition: right var(--duration-normal) var(--ease-out);
        }

        &:hover {
          color: var(--color-accent);

          &::after {
            right: 0;
          }
        }

        &.is-active {
          color: var(--color-accent);

          &::after {
            right: 0;
          }
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
