import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-articles-page',
  imports: [SectionHeadingComponent, ArticleCardComponent, TranslatePipe],
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesPage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);
  protected readonly translate = inject(TranslateService);

  protected readonly articles = computed(() => this.contentService.getArticles());
  protected readonly categories = computed(() => [...new Set(this.articles().map((article) => article.categoryKey))]);

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.articles.seo.title'),
        description: this.translate.t('pages.articles.seo.description'),
        canonicalPath: '/articles'
      });
    });
  }
}
