import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-topics-page',
  imports: [RouterLink, SectionHeadingComponent],
  templateUrl: './topics.page.html',
  styleUrl: './topics.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicsPage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);

  protected readonly topics = this.contentService.getTopics();

  constructor() {
    this.seoService.update({
      title: 'Topics',
      description:
        'Explore AIforGermany topics across Industry 5.0, startups, research, and policy in a scalable category overview.',
      canonicalPath: '/topics',
      keywords: ['AI topics Germany', 'Industry 5.0 Germany', 'German AI policy']
    });
  }

  protected articlesFor(topicSlug: string) {
    return this.contentService.getArticlesByTopic(topicSlug, 2);
  }
}
