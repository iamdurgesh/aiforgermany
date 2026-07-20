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

  /** Scrolls to the top of the page; speed follows `scroll-behavior` (reduced motion: instant). */
  protected scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0 });
  }
}
