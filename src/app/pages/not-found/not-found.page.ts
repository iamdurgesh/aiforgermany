import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '@core/seo/seo.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundPage {
  private readonly seoService = inject(SeoService);

  constructor() {
    this.seoService.update({
      title: 'Page not found',
      description: 'The requested page could not be found on AIforGermany.'
    });
  }
}
