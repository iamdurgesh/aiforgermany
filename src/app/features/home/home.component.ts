import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <main>
      <h1>AI for Germany</h1>
      <p>
        Das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im deutschen
        Mittelstand.
      </p>
      <p>Diese Seite befindet sich im Aufbau.</p>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
