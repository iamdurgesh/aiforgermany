import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { SeoService } from '@core/seo/seo.service';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-about-page',
  imports: [SectionHeadingComponent, NewsletterCtaComponent, TranslatePipe],
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPage {
  private readonly seoService = inject(SeoService);
  private readonly translate = inject(TranslateService);

  protected readonly principles = computed(() => [
    this.translate.t('pages.about.principles.one'),
    this.translate.t('pages.about.principles.two'),
    this.translate.t('pages.about.principles.three')
  ]);

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.about.seo.title'),
        description: this.translate.t('pages.about.seo.description'),
        canonicalPath: '/about'
      });
    });
  }
}
