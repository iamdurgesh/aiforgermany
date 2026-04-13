import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { LocaleService } from '@core/i18n/locale.service';
import { appLocales, defaultLocale, localeDefinitions } from '@core/i18n/locale.model';
import { toLocalizedPath } from '@core/i18n/locale.utils';
import { Meta, Title } from '@angular/platform-browser';
import { siteConfig } from '@core/config/site.config';
import { SeoMetadata } from '@core/models/seo-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly localeService = inject(LocaleService);

  update(metadata: SeoMetadata): void {
    const title = metadata.title.includes(siteConfig.name) ? metadata.title : `${metadata.title} | ${siteConfig.name}`;
    const description = metadata.description;
    const canonicalPath = toLocalizedPath(this.localeService.currentLocale(), this.normalisePath(metadata.canonicalPath));
    const canonicalUrl = `${siteConfig.siteUrl}${canonicalPath}`;

    this.title.setTitle(title);
    this.setNameMeta('description', description);
    this.setNameMeta('keywords', metadata.keywords?.join(', ') ?? '');
    this.setNameMeta('robots', 'index,follow');
    this.setNameMeta('twitter:card', 'summary');
    this.setNameMeta('twitter:title', title);
    this.setNameMeta('twitter:description', description);
    this.setPropertyMeta('og:title', title);
    this.setPropertyMeta('og:description', description);
    this.setPropertyMeta('og:type', metadata.type ?? 'website');
    this.setPropertyMeta('og:url', canonicalUrl);
    this.updateCanonical(canonicalUrl);
    this.updateAlternateLinks(this.normalisePath(metadata.canonicalPath));
  }

  private setNameMeta(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setPropertyMeta(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private updateCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private updateAlternateLinks(path: string): void {
    for (const locale of appLocales) {
      const href = `${siteConfig.siteUrl}${toLocalizedPath(locale, path)}`;
      let link = this.document.head.querySelector(`link[rel="alternate"][hreflang="${localeDefinitions[locale].htmlLang}"]`);

      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'alternate');
        link.setAttribute('hreflang', localeDefinitions[locale].htmlLang);
        this.document.head.appendChild(link);
      }

      link.setAttribute('href', href);
    }

    let defaultLink = this.document.head.querySelector('link[rel="alternate"][hreflang="x-default"]');

    if (!defaultLink) {
      defaultLink = this.document.createElement('link');
      defaultLink.setAttribute('rel', 'alternate');
      defaultLink.setAttribute('hreflang', 'x-default');
      this.document.head.appendChild(defaultLink);
    }

    defaultLink.setAttribute('href', `${siteConfig.siteUrl}${toLocalizedPath(defaultLocale, path)}`);
  }

  private normalisePath(path?: string): string {
    const value = path ?? this.document.location?.pathname ?? '/';
    return value.startsWith('/') ? value : `/${value}`;
  }
}
