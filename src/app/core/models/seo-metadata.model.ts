export interface SeoMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  type?: 'website' | 'article';
}
