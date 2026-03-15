import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '@core/seo/seo.service';
import { SectionHeadingComponent } from '@shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-newsletter-page',
  imports: [SectionHeadingComponent],
  templateUrl: './newsletter.page.html',
  styleUrl: './newsletter.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsletterPage {
  private readonly seoService = inject(SeoService);

  protected readonly editorialValue = [
    'A weekly summary of the most relevant AI signals across Germany.',
    'Short analysis on industrial adoption, startups, research, and policy.',
    'A format designed for busy operators, founders, researchers, and policymakers.'
  ];

  constructor() {
    this.seoService.update({
      title: 'Newsletter',
      description:
        'Explore the AIforGermany newsletter section and its weekly briefing on AI across Germany.',
      canonicalPath: '/newsletter'
    });
  }
}
