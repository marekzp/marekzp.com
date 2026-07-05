// Single source of truth for identity. The hub page, JSON-LD, header, footer,
// and RSS all read from this object — a link that changes gets edited here once.
export const site = {
  url: 'https://marekzp.com',
  name: 'Marek Zaremba-Pike',
  handle: 'marekzp',
  jobTitle: 'Head of Backend',
  employer: {
    name: 'Photoroom',
    url: 'https://www.photoroom.com',
  },
  title: 'Marek Zaremba-Pike — Head of Backend at Photoroom',
  description:
    'Marek Zaremba-Pike leads the backend platform at Photoroom and builds production AI systems. Writing on backend engineering and agentic coding.',
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
  cloudflareAnalyticsToken: '',
  projects: [
    {
      name: 'Savin Hood',
      url: 'https://savinhood.com',
      description:
        'UK income tax calculator that tracks income year-round and flags threshold cliffs before they cost you. Rust and Python/Django backend, TypeScript and Astro frontend, built end-to-end with agentic tooling.',
    },
  ],
} as const;
