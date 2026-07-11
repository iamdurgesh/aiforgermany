import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page einblenden">
      <p class="code" aria-hidden="true">404</p>
      <h1>Seite nicht gefunden</h1>
      <p>
        Die aufgerufene Adresse existiert nicht (Fehler 404). Vielleicht hilft einer dieser
        Einstiege weiter:
      </p>
      <ul>
        <li><a routerLink="/artikel">Artikel zu KI-Regulierung und KI-Einsatz</a></li>
        <li><a routerLink="/schnellcheck">KI-Act Schnellcheck</a></li>
        <li><a routerLink="/glossar">Glossar der wichtigsten Begriffe</a></li>
        <li><a routerLink="/">Startseite</a></li>
      </ul>
    </div>
  `,
  styles: `
    .code {
      font-size: clamp(4rem, 12vw, 7rem);
      font-weight: 800;
      letter-spacing: var(--tracking-tight);
      line-height: 1;
      background: linear-gradient(135deg, var(--color-accent-line), var(--color-accent));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: var(--space-3);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
