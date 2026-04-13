import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-newsletter-cta',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './newsletter-cta.component.html',
  styleUrl: './newsletter-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterCtaComponent {
  protected readonly localizedRouter = inject(LocalizedRouterService);
  readonly title = input<string | null>(null);
  readonly description = input<string | null>(null);
}
