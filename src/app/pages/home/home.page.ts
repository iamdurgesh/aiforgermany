import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { HeroSectionComponent } from '@shared/components/hero-section/hero-section.component';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionComponent, SectionHeadingComponent, ArticleCardComponent, NewsletterCtaComponent, TranslatePipe],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);
  private readonly translate = inject(TranslateService);

  protected readonly featuredArticles = computed(() => this.contentService.getFeaturedArticles());
  protected readonly topics = computed(() => this.contentService.getTopics());

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.home.seo.title'),
        description: this.translate.t('pages.home.seo.description'),
        canonicalPath: '/'
      });
    });
  }
}
