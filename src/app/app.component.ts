import { DOCUMENT, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './core/layout/footer.component';
import { HeaderComponent } from './core/layout/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  /** Scrollt zum Seitenanfang; Tempo folgt `scroll-behavior` (reduced motion: sofort). */
  protected nachOben(): void {
    this.document.defaultView?.scrollTo({ top: 0 });
  }
}
