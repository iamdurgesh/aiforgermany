export const appLocales = ['en', 'de'] as const;

export type AppLocale = (typeof appLocales)[number];

export interface LocaleDefinition {
  code: AppLocale;
  label: string;
  htmlLang: string;
  dateLocale: string;
}

export const defaultLocale: AppLocale = 'en';
export const localeStorageKey = 'aiforgermany.locale';

export const localeDefinitions: Record<AppLocale, LocaleDefinition> = {
  en: {
    code: 'en',
    label: 'English',
    htmlLang: 'en',
    dateLocale: 'en-US'
  },
  de: {
    code: 'de',
    label: 'Deutsch',
    htmlLang: 'de',
    dateLocale: 'de-DE'
  }
};

export type LocalizedContent<T> = Record<AppLocale, T>;

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return typeof value === 'string' && appLocales.includes(value as AppLocale);
}

export function detectLocale(value: string | null | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (isAppLocale(normalized)) {
    return normalized;
  }

  const languageCode = normalized.split('-')[0];

  return isAppLocale(languageCode) ? languageCode : null;
}

export function normalizeLocale(value: string | null | undefined, fallback: AppLocale = defaultLocale): AppLocale {
  return detectLocale(value) ?? fallback;
}
