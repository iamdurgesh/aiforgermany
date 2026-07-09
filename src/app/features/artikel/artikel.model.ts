/** Ein Fachartikel, generiert aus /content/artikel/*.md (siehe tools/build-content.mjs). */
export interface Artikel {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  /** Veröffentlichungsdatum im Format YYYY-MM-DD. */
  readonly date: string;
  readonly keywords: readonly string[];
  /** Aus Markdown gerendertes HTML (nur eigene Inhalte aus dem Repo). */
  readonly html: string;
}
