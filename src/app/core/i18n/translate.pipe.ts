import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslationKey } from './translations';

@Pipe({
  name: 't',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private lastLocale?: string;
  private lastKey?: TranslationKey;
  private lastParams?: Record<string, string | number>;
  private lastValue = '';

  constructor(private readonly translateService: TranslateService) {}

  transform(key: TranslationKey, params?: Record<string, string | number>): string {
    const locale = this.translateService.locale();

    if (this.lastLocale === locale && this.lastKey === key && this.lastParams === params) {
      return this.lastValue;
    }

    this.lastLocale = locale;
    this.lastKey = key;
    this.lastParams = params;
    this.lastValue = this.translateService.t(key, params);

    return this.lastValue;
  }
}
