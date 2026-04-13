import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isAppLocale } from './locale.model';
import { LocaleService } from './locale.service';
import { swapLocaleInUrl } from './locale.utils';

export const rootLocaleRedirectGuard: CanMatchFn = (_route, segments) => {
  if (segments.length > 0) {
    return false;
  }

  const router = inject(Router);
  const localeService = inject(LocaleService);

  return router.parseUrl(`/${localeService.getPreferredLocale()}`);
};

export const localeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localeService = inject(LocaleService);
  const locale = route.paramMap.get('locale');

  if (!isAppLocale(locale)) {
    return router.parseUrl(swapLocaleInUrl(state.url, localeService.getPreferredLocale()));
  }

  localeService.setLocale(locale);

  return true;
};
