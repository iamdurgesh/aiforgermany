import { NavItem } from '@core/models/nav-item.model';

export const siteNavigation: NavItem[] = [
  { labelKey: 'navigation.home', route: '', exact: true },
  { labelKey: 'navigation.articles', route: 'articles' },
  { labelKey: 'navigation.topics', route: 'topics' },
  { labelKey: 'navigation.about', route: 'about' },
  { labelKey: 'navigation.newsletter', route: 'newsletter' }
];

export const siteConfig = {
  name: 'AIforGermany',
  siteUrl: 'https://www.aiforgermany.de',
  newsletterEmail: 'editors@aiforgermany.de'
} as const;
