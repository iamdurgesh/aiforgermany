import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { siteConfig, siteNavigation } from '@core/config/site.config';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly navigation = siteNavigation;
  protected readonly site = siteConfig;
  protected readonly themeKeys = [
    'footer.themes.industry',
    'footer.themes.startups',
    'footer.themes.research',
    'footer.themes.policy'
  ] as const;
}
