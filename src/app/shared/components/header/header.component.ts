import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppLocale } from '@core/i18n/locale.model';
import { LocalizedRouterService } from '@core/i18n/localized-router.service';
import { LocaleService } from '@core/i18n/locale.service';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { siteNavigation } from '@core/config/site.config';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly router = inject(Router);
  protected readonly localeService = inject(LocaleService);
  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly navigation = siteNavigation;
  protected readonly locales = this.localeService.availableLocales;

  protected switchLocale(locale: AppLocale): void {
    const previousLocale = this.localeService.currentLocale();

    if (previousLocale === locale) {
      return;
    }

    this.localeService.setLocale(locale);

    void this.router.navigateByUrl(this.localizedRouter.switchLocalePath(locale)).catch(() => {
      this.localeService.setLocale(previousLocale);
    });
  }
}
