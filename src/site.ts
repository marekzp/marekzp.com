// Single source of truth for identity. The hub page, JSON-LD, header, footer,
// and RSS all read from this object — a link that changes gets edited here once.
export const site = {
  url: 'https://marekzp.com',
  name: 'Marek Zaremba-Pike',
  handle: 'marekzp',
  jobTitle: 'Staff Engineer, Engineering Lead Core AI Platform',
  employer: {
    name: 'Photoroom',
    url: 'https://www.photoroom.com',
  },
  description:
    'Marek Zaremba-Pike leads Photoroom’s Core AI Platform. Writing on production AI systems and agentic engineering.',
  // Swap for hello@marekzp.com once Cloudflare Email Routing is set up.
  email: 'marekzp@gmail.com',
  profiles: {
    github: 'https://github.com/marekzp',
    linkedin: 'https://www.linkedin.com/in/marekzp/',
    substack: 'https://marekzp.substack.com',
  },
  alumniOf: 'University of Bath',
  memberOf: 'BCS, The Chartered Institute for IT',
  // Paste the Cloudflare Web Analytics token here after enabling it in the
  // dashboard; the beacon script is omitted while this is empty.
  cloudflareAnalyticsToken: '45ab519ff0984d2aa52a8f956edee40c',
  projects: [
    {
      name: 'Savin Hood',
      url: 'https://savinhood.com',
      description:
        'UK income tax calculator that tracks income year-round and flags threshold cliffs before they cost you. Rust and Python/Django backend, TypeScript and Astro frontend, built end-to-end with agentic tooling.',
    },
    {
      name: 'zero-downtime-migrations',
      url: 'https://github.com/Photoroom/zero-downtime-migrations',
      description:
        'PostgreSQL migration safety linter for Alembic, Django and Tortoise. Written in Rust, with 17 rules, and published on PyPI. Built at Photoroom.',
    },
  ],
} as const;
