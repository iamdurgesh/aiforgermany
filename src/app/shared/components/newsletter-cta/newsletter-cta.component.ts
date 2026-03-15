import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newsletter-cta',
  imports: [RouterLink],
  templateUrl: './newsletter-cta.component.html',
  styleUrl: './newsletter-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterCtaComponent {
  readonly title = input('Subscribe to the weekly AIforGermany briefing');
  readonly description = input(
    'A concise weekly dispatch covering German AI industry moves, startup traction, research signals, and policy developments.'
  );
}
