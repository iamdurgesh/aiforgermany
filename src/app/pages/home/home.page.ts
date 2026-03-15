import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '@core/services/content.service';
import { SeoService } from '@core/seo/seo.service';
import { ArticleCardComponent } from '@shared/components/article-card/article-card.component';
import { HeroAction, HeroSectionComponent, HeroStat } from '@shared/components/hero-section/hero-section.component';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionComponent, SectionHeadingComponent, ArticleCardComponent, NewsletterCtaComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  private readonly seoService = inject(SeoService);
  private readonly contentService = inject(ContentService);

  protected readonly featuredArticles = this.contentService.getFeaturedArticles();
  protected readonly topics = this.contentService.getTopics();
  protected readonly heroActions: readonly HeroAction[] = [
    { label: 'Read latest coverage', route: '/articles', variant: 'primary' },
    { label: 'Explore topics', route: '/topics', variant: 'secondary' }
  ];
  protected readonly heroStats: readonly HeroStat[] = [
    { value: '5', label: 'Core coverage areas spanning industry, startups, research, policy, and innovation.' },
    { value: 'SSR', label: 'Search-friendly Angular rendering from day one for editorial publishing.' },
    { value: 'Ready', label: 'Foundation prepared for reports, directories, and data-driven category pages.' }
  ];

  constructor() {
    this.seoService.update({
      title: 'AI for Germany',
      description:
        'AIforGermany is a modern editorial platform covering AI across German industry, startups, research, policy, and innovation.',
      canonicalPath: '/',
      keywords: ['AI Germany', 'German AI startups', 'Industry 5.0', 'AI policy Germany']
    });
  }
}
