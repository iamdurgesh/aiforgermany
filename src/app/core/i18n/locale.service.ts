import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  AppLocale,
  appLocales,
  defaultLocale,
  localeDefinitions,
  localeStorageKey,
  normalizeLocale
} from './locale.model';
import { getLocaleFromPath } from './locale.utils';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localeState = signal<AppLocale>(this.resolveInitialLocale());

  readonly currentLocale = this.localeState.asReadonly();
  readonly availableLocales = appLocales.map((code) => localeDefinitions[code]);
  readonly settings = computed(() => localeDefinitions[this.currentLocale()]);

  constructor() {
    effect(() => {
      const locale = this.currentLocale();

      this.document.documentElement.lang = localeDefinitions[locale].htmlLang;

      if (isPlatformBrowser(this.platformId)) {
        this.writeStoredLocale(locale);
      }
    });
  }

  setLocale(locale: string | null | undefined): void {
    this.localeState.set(normalizeLocale(locale, defaultLocale));
  }

  getPreferredLocale(): AppLocale {
    return normalizeLocale(this.getStoredLocale() ?? this.getBrowserLocale(), defaultLocale);
  }

  private resolveInitialLocale(): AppLocale {
    const pathLocale = getLocaleFromPath(this.document.location?.pathname ?? '');

    if (pathLocale) {
      return pathLocale;
    }

    return this.getPreferredLocale();
  }

  private getStoredLocale(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      return globalThis.localStorage?.getItem(localeStorageKey) ?? null;
    } catch {
      return null;
    }
  }

  private writeStoredLocale(locale: AppLocale): void {
    try {
      globalThis.localStorage?.setItem(localeStorageKey, locale);
    } catch {
      // Ignore storage write failures in private mode or restricted environments.
    }
  }

  private getBrowserLocale(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return globalThis.navigator?.language ?? null;
  }
}
