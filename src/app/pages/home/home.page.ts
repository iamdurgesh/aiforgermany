import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { HeroAction, HeroSectionComponent, HeroStat } from '@shared/components/hero-section/hero-section.component';
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
  private readonly localizedRouter = inject(LocalizedRouterService);

  protected readonly featuredArticles = computed(() => this.contentService.getFeaturedArticles());
  protected readonly topics = computed(() => this.contentService.getTopics());
  protected readonly heroActions = computed<readonly HeroAction[]>(() => [
    {
      label: this.translate.t('pages.home.hero.latestCoverage'),
      route: this.localizedRouter.path('articles'),
      variant: 'primary'
    },
    {
      label: this.translate.t('pages.home.hero.exploreTopics'),
      route: this.localizedRouter.path('topics'),
      variant: 'secondary'
    }
  ]);
  protected readonly heroStats = computed<readonly HeroStat[]>(() => [
    { value: '5', label: this.translate.t('pages.home.hero.coverageAreas') },
    { value: 'SSR', label: this.translate.t('pages.home.hero.searchFriendly') },
    { value: this.translate.t('pages.home.hero.readyValue'), label: this.translate.t('pages.home.hero.scalableFoundation') }
  ]);

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
