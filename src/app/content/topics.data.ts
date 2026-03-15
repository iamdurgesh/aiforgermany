import { Topic } from '@core/models/topic.model';

export const topicsData: Topic[] = [
  {
    slug: 'industry-5-0',
    name: 'Industry 5.0',
    summary: 'AI adoption in manufacturing, robotics, quality systems, and worker-centered production.',
    description:
      'Coverage of how German industry uses AI to improve resilience, throughput, safety, and human-machine collaboration.',
    focusAreas: ['Factory operations', 'Robotics', 'Industrial data', 'Maintenance'],
    articleCount: 12
  },
  {
    slug: 'german-ai-startups',
    name: 'German AI startups',
    summary: 'Enterprise AI companies emerging across Berlin, Munich, and regional innovation clusters.',
    description:
      'Reporting on startup formation, category creation, funding signals, and the realities of selling AI into European enterprises.',
    focusAreas: ['Enterprise software', 'Founders', 'Go-to-market', 'Funding'],
    articleCount: 9
  },
  {
    slug: 'research-ecosystem',
    name: 'Research ecosystem',
    summary: 'Universities, institutes, labs, and technology transfer shaping the applied AI pipeline.',
    description:
      'A close look at how German research strength translates into products, public capability, and industrial deployment.',
    focusAreas: ['Universities', 'Applied research', 'Talent', 'Technology transfer'],
    articleCount: 7
  },
  {
    slug: 'policy-and-governance',
    name: 'Policy and governance',
    summary: 'Regulation, public-sector capacity, and the institutions shaping AI deployment in Germany.',
    description:
      'Contextual reporting on policy developments, compliance expectations, and competitiveness implications for the ecosystem.',
    focusAreas: ['AI Act context', 'Procurement', 'Digital state', 'Competitiveness'],
    articleCount: 8
  }
];
