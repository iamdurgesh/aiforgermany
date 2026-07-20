/** An article, generated from /content/artikel/*.md (see tools/build-content.mjs). */
export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  /** Publication date in YYYY-MM-DD format. */
  readonly date: string;
  readonly keywords: readonly string[];
  /** HTML rendered from Markdown (only our own content from the repo). */
  readonly html: string;
}
