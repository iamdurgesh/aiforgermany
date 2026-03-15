import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '@core/seo/seo.service';
import { NewsletterCtaComponent } from '@shared/components/newsletter-cta/newsletter-cta.component';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-about-page',
  imports: [SectionHeadingComponent, NewsletterCtaComponent],
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPage {
  private readonly seoService = inject(SeoService);

  protected readonly principles = [
    'Explain how AI affects German industry, not just how the technology works in theory.',
    'Connect research, startups, public institutions, and enterprise adoption into one coherent narrative.',
    'Prioritize clarity, context, and practical relevance over hype.'
  ];

  constructor() {
    this.seoService.update({
      title: 'About',
      description:
        'Learn about the editorial mission behind AIforGermany and how the platform covers AI across the German ecosystem.',
      canonicalPath: '/about'
    });
  }
}
