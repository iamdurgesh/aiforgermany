import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
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

  update(metadata: SeoMetadata): void {
    const title = metadata.title.includes(siteConfig.name) ? metadata.title : `${metadata.title} | ${siteConfig.name}`;
    const description = metadata.description;
    const canonicalPath = this.normalisePath(metadata.canonicalPath);
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

  private normalisePath(path?: string): string {
    const value = path ?? this.document.location?.pathname ?? '/';
    return value.startsWith('/') ? value : `/${value}`;
  }
}
