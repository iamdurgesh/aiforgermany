import { DatePipe } from '@angular/common';
import { computed, effect, inject, ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';

@Component({
  selector: 'app-article-detail-page',
  imports: [RouterLink, DatePipe, ArticleCardComponent, NewsletterCtaComponent],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);
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
          title: 'Article not found',
          description: 'The requested article could not be found.',
          canonicalPath: `/articles/${this.slug()}`
        });

        return;
      }

      this.seoService.update({
        title: article.title,
        description: article.seoDescription,
        canonicalPath: `/articles/${article.slug}`,
        keywords: [article.category, article.heroEyebrow, 'AI Germany article'],
        type: 'article'
      });
    });
  }
}
