import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ueber',
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1>Über dieses Portal</h1>

      <p>
        AI for Germany ist das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im
        deutschen Mittelstand. Es richtet sich an IT-Leitungen, CISOs,
        Datenschutzbeauftragte und Geschäftsführungen von Unternehmen mit etwa 100 bis 2.000
        Mitarbeitenden.
      </p>

      <h2>Was Sie hier finden</h2>
      <ul>
        <li>
          <a routerLink="/artikel">Fachartikel</a> zu EU AI Act, Schatten-KI, KI-Inventar und
          verwandten Pflichten — nüchtern und praxisnah aufbereitet,
        </li>
        <li>ein <a routerLink="/glossar">Glossar</a> der wichtigsten Begriffe,</li>
        <li>
          den <a routerLink="/schnellcheck">KI-Act Schnellcheck</a> für eine erste, unverbindliche
          Orientierung,
        </li>
        <li>
          einen monatlichen <a routerLink="/newsletter">Newsletter</a>: KI-Regulierung in 5
          Minuten.
        </li>
      </ul>

      <h2>Unabhängigkeit</h2>
      <p>
        Die Redaktion arbeitet unabhängig. Inhalte auf diesem Portal sind keine bezahlten
        Beiträge; es gibt keine Werbe-Tracker und keine Marketing-Pixel. Sollten künftig
        Verbindungen zu Produkten oder Anbietern bestehen, werden sie an der jeweiligen Stelle
        klar gekennzeichnet.
      </p>

      <h2>Keine Rechtsberatung</h2>
      <p>
        Alle Inhalte — einschließlich des Schnellchecks — dienen der allgemeinen Information und
        ersetzen keine Rechtsberatung. Für verbindliche Einschätzungen wenden Sie sich an
        qualifizierte Rechtsberatung.
      </p>

      <h2>Kontakt</h2>
      <p>
        Redaktion AI for Germany<br />
        E-Mail: <mark class="fill-in">[AUSFÜLLEN: Redaktions-E-Mail-Adresse]</mark>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UeberComponent {}
