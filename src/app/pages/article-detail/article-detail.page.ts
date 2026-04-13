import { computed, effect, inject, ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LocalizedDatePipe } from '@core/i18n/localized-date.pipe';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';

@Component({
  selector: 'app-article-detail-page',
  imports: [RouterLink, LocalizedDatePipe, ArticleCardComponent, NewsletterCtaComponent, TranslatePipe],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);
  private readonly translate = inject(TranslateService);
  protected readonly localizedRouter = inject(LocalizedRouterService);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' }
  );

  protected readonly article = computed(() => this.contentService.getArticleBySlug(this.slug()));
  protected readonly relatedArticles = computed(() => {
    const article = this.article();
    return article ? this.contentService.getRelatedArticles(article.slug, article.topicSlug) : [];
  });

  constructor() {
    effect(() => {
      const article = this.article();

      if (!article) {
        this.seoService.update({
          title: this.translate.t('pages.articleDetail.missing.seoTitle'),
          description: this.translate.t('pages.articleDetail.missing.seoDescription'),
          canonicalPath: `/articles/${this.slug()}`
        });

        return;
      }

      this.seoService.update({
        title: article.title,
        description: article.seoDescription,
        canonicalPath: `/articles/${article.slug}`,
        keywords: [this.translate.category(article.categoryKey), article.heroEyebrow, 'AIforGermany'],
        type: 'article'
      });
    });
  }

  protected readonly i18n = this.translate;
}
