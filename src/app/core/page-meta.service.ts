import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE_NAME, SITE_URL } from './site';

export interface PageMeta {
  /** Vollständiger Titel inkl. Portal-Suffix. */
  title: string;
  description: string;
  /** Pfad ab Root, z. B. `/artikel/schatten-ki-erkennen`. */
  path: string;
  ogType?: 'website' | 'article';
}

/**
 * Setzt Titel, Meta-Description, Canonical-Link und OG-Tags pro Route
 * (WORKING MAP §3: Meta/OG je Route). Wird von den Seiten-Komponenten im
 * Konstruktor aufgerufen und wirkt damit auch beim Prerendering.
 */
@Injectable({ providedIn: 'root' })
export class PageMetaService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setPage(page: PageMeta): void {
    const url = `${SITE_URL}${page.path}`;
    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:type', content: page.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'de_DE' });
    this.setCanonical(url);
  }

  /** Ersetzt das JSON-LD-Skript der Seite (z. B. Article-Schema). */
  setJsonLd(data: Record<string, unknown>): void {
    const id = 'page-json-ld';
    this.document.getElementById(id)?.remove();
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  removeJsonLd(): void {
    this.document.getElementById('page-json-ld')?.remove();
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
