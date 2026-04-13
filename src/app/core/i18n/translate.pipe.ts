import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslationKey } from './translations';

@Pipe({
  name: 't',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  transform(key: TranslationKey, params?: Record<string, string | number>): string {
    return this.translateService.t(key, params);
  }
}
