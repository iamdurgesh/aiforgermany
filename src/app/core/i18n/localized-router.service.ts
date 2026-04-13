import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocale } from './locale.model';
import { LocaleService } from './locale.service';
import { swapLocaleInUrl, toLocalizedPath } from './locale.utils';

@Injectable({
  providedIn: 'root'
})
export class LocalizedRouterService {
  private readonly localeService = inject(LocaleService);
  private readonly router = inject(Router);

  path(path = ''): string {
    return toLocalizedPath(this.localeService.currentLocale(), path);
  }

  articlePath(slug: string): string {
    return this.path(`articles/${slug}`);
  }

  switchLocalePath(locale: AppLocale, url = this.router.url): string {
    return swapLocaleInUrl(url, locale);
  }
}
