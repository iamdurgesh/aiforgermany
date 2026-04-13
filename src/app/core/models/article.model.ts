export type ArticleCategoryKey = 'industry' | 'startups' | 'research' | 'policy';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  categoryKey: ArticleCategoryKey;
  topicSlug: string;
  readTimeMinutes: number;
  publishedAt: string;
  author: string;
  heroEyebrow: string;
  seoDescription: string;
  keyTakeaways: string[];
  bodySections: string[];
}
