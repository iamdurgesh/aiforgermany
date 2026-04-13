import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { SeoService } from '@core/seo/seo.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-newsletter-page',
  imports: [SectionHeadingComponent, TranslatePipe],
  templateUrl: './newsletter.page.html',
  styleUrl: './newsletter.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterPage {
  private readonly seoService = inject(SeoService);
  private readonly translate = inject(TranslateService);

  protected readonly editorialValue = computed(() => [
    this.translate.t('pages.newsletter.expectations.one'),
    this.translate.t('pages.newsletter.expectations.two'),
    this.translate.t('pages.newsletter.expectations.three')
  ]);

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.newsletter.seo.title'),
        description: this.translate.t('pages.newsletter.seo.description'),
        canonicalPath: '/newsletter'
      });
    });
  }
}
