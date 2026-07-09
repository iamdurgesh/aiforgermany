import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
