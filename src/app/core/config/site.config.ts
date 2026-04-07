import { NavItem } from '@core/models/nav-item.model';

export const siteNavigation: NavItem[] = [
  { label: 'Home', route: '/', exact: true },
  { label: 'Articles', route: '/articles' },
  { label: 'Topics', route: '/topics' },
  { label: 'About', route: '/about' },
  { label: 'Newsletter', route: '/newsletter' }
];

export const siteConfig = {
  name: 'AIforGermany',
  title: 'AIforGermany | AI, Industry, Startups, Research, Policy',
  description:
    'AIforGermany covers the companies, research labs, policymakers, and industrial shifts shaping AI adoption across Germany.',
  siteUrl: 'https://www.aiforgermany.de',
  newsletterEmail: 'editors@aiforgermany.de',
  newsletterBlurb:
    'A concise weekly briefing on AI in German industry, startups, research, and policy.',
  footerThemes: ['Industry 5.0', 'German AI startups', 'Research ecosystem', 'Policy and regulation']
} as const;
