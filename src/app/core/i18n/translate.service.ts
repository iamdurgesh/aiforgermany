import { inject, Injectable } from '@angular/core';
import { ArticleCategoryKey } from '@core/models/article.model';
import { LocaleService } from './locale.service';
import { resolveTranslation, TranslationKey } from './translations';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly localeService = inject(LocaleService);
  private readonly cache = new Map<string, string>();

  readonly locale = this.localeService.currentLocale;

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    const locale = this.locale();
    const cacheKey = params
      ? `${locale}:${key}:${JSON.stringify(params)}`
      : `${locale}:${key}`;

    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const template = resolveTranslation(locale, key);

    const resolved = !params
      ? template
      : Object.entries(params).reduce(
          (message, [token, value]) => message.replaceAll(`{${token}}`, String(value)),
          template
        );

    this.cache.set(cacheKey, resolved);
    return resolved;
  }

  stories(count: number): string {
    return this.t('common.stories', { count });
  }

  readTime(count: number): string {
    return this.t('common.readTime', { count });
  }

  category(categoryKey: ArticleCategoryKey): string {
    return this.t(`content.categories.${categoryKey}` as TranslationKey);
  }
}
