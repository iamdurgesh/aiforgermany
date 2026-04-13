import { inject, Injectable } from '@angular/core';
import { ArticleCategoryKey } from '@core/models/article.model';
import { LocaleService } from './locale.service';
import { resolveTranslation, TranslationKey } from './translations';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private readonly localeService = inject(LocaleService);

  readonly locale = this.localeService.currentLocale;

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    const template = resolveTranslation(this.locale(), key);

    if (!params) {
      return template;
    }

    return Object.entries(params).reduce(
      (message, [token, value]) => message.replaceAll(`{${token}}`, String(value)),
      template
    );
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
