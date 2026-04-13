import { TranslationKey } from '@core/i18n/translations';

export interface NavItem {
  labelKey: TranslationKey;
  route: string;
  exact?: boolean;
}
