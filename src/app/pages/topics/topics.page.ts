import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { TranslateService } from '@core/i18n/translate.service';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-topics-page',
  imports: [RouterLink, SectionHeadingComponent, TranslatePipe],
  templateUrl: './topics.page.html',
  styleUrl: './topics.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicsPage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);
  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly translate = inject(TranslateService);

  protected readonly topics = computed(() => this.contentService.getTopics());

  constructor() {
    effect(() => {
      this.seoService.update({
        title: this.translate.t('pages.topics.seo.title'),
        description: this.translate.t('pages.topics.seo.description'),
        canonicalPath: '/topics'
      });
    });
  }

  protected articlesFor(topicSlug: string) {
    return this.contentService.getArticlesByTopic(topicSlug, 2);
  }
}
