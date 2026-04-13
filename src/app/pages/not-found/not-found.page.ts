import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage {
  private readonly seoService = inject(SeoService);
  private readonly translate = inject(TranslateService);
  protected readonly localizedRouter = inject(LocalizedRouterService);

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.notFound.seo.title'),
        description: this.translate.t('pages.notFound.seo.description')
      });
    });
  }
}
