import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private readonly localeService: LocaleService) {}

  transform(value: string | Date | number | null | undefined, format = 'mediumDate'): string {
    if (!value) {
      return '';
    }

    return formatDate(value, format, this.localeService.settings().dateLocale);
  }
}
