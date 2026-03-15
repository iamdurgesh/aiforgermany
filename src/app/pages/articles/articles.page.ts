import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-articles-page',
  imports: [SectionHeadingComponent, ArticleCardComponent],
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesPage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);

  protected readonly articles = this.contentService.getArticles();
  protected readonly categories = [...new Set(this.articles.map((article) => article.category))];

  constructor() {
    this.seoService.update({
      title: 'Articles',
      description:
        'Browse AIforGermany coverage across industry, startups, research, and policy in a clean editorial article index.',
      canonicalPath: '/articles',
      keywords: ['AI articles Germany', 'German AI analysis', 'AI industry coverage']
    });
  }
}
