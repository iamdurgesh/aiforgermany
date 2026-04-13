import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  protected readonly localeService = inject(LocaleService);
  protected readonly localizedRouter = inject(LocalizedRouterService);
  protected readonly navigation = siteNavigation;
  protected readonly locales = this.localeService.availableLocales;
}
