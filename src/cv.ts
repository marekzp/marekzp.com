// CV content — the /cv/ page and the generated cv.pdf render from this.
// Deliberately excludes the phone number from the source document: this file
// is public (site + repo). Contact is email + LinkedIn only.
export const cv = {
  updated: 'June 2026',
  headline: 'UK citizen',
  summary:
    'Staff engineer building and deploying production AI systems at scale. Led high-throughput backend platforms (2,500+ RPS) and designed LLM integrations with safeguards including rate limiting, fallbacks, and abuse prevention. Currently focused on building and optimising agentic coding workflows.',
  technologies: [
    'Python, Django, FastAPI',
    'Kubernetes, Lambda',
    'Managed projects in Angular, PHP, React, Vue.js',
    'AWS, Google Cloud Platform, DigitalOcean, and private data centres/on-prem',
    'Microservices, event-driven architecture, data pipelines',
    'Production applications with Claude, GPT, Gemini, Black Forest Labs, and internal AI APIs',
    'GitHub Actions, GitLab CI/CD',
    'SNS/SQS, custom message queues, AWS Step Functions',
    'DynamoDB, Elasticsearch, PostgreSQL, Redis',
  ],
  experience: [
    {
      period: 'Dec 2024 – present',
      role: 'Staff Engineer, Head of Backend',
      company: 'Photoroom',
      sector: 'AI & e-commerce',
      bullets: [
        "A hands-on (65% IC) role responsible for Photoroom's Django and FastAPI backend (2,500 requests per second, 10TB database), managing 4 direct reports.",
        'Oversaw the FastAPI AI gateway, handling frontend requests to internal and external AI endpoints, including model fallbacks, rate limiting, abuse prevention, and request enrichment to ensure safe and reliable model use at scale.',
        'Expanded system monitoring (anomalies, SLOs, error rates) to improve incident detection and response times.',
        'Led the migration to Kubernetes with zero-downtime deployments (including data migrations); introduced automated deployments and a testing environment for client developers.',
        "Tech lead for the cross-platform (Android, backend, iOS, and web) redesign of the billing system to closely align users' AI usage with subscription fees.",
        'Built an agentic coding pipeline with structured evaluation, delivering 50–90% of merged PRs per week. 80%+ of PRs received fewer than 3 change requests by using context-specific skills, reference files, and deterministic checks. Pipeline monitored (including chain-of-thought) for optimisation.',
      ],
    },
    {
      period: 'Aug 2022 – Oct 2024',
      role: 'Staff Engineer',
      company: 'Lantum',
      sector: 'healthcare & finance',
      bullets: [
        'Planned, led, and worked on the refactor of the entire backend (Python/Django), reducing complexity, upgrading libraries, hardening security, and enabling new features.',
        'Oversaw tech support and incident response; trained the team, established reporting systems, and built better monitoring and logs — reducing feature squads’ exposure from 25% of their time to less than 1%, and reducing developer churn.',
        'Established and evangelised software processes, patterns, and ways of working.',
        'Designed and developed internal tools for operations to increase their efficiency.',
      ],
    },
    {
      period: 'Jul 2021 – Jul 2022',
      role: 'Technical Director (CTO)',
      company: 'TrackTrack',
      sector: 'legal tech',
      bullets: [
        'Transformed the software architecture, infrastructure, team, and development processes to allow rapid growth in clients, including on-prem deployments inside client DMZs.',
        'Oversaw the breakup of the Python/Django software into serverless microservices in a multi-cloud environment, including on-prem client infrastructure.',
        'Led projects to increase test coverage, introduce an automated deployment pipeline, and ensure complete documentation.',
      ],
    },
    {
      period: 'Nov 2019 – Jun 2021',
      role: 'Consulting Software Engineer & Architect',
      company: 'European Public Affairs Technologies',
      sector: 'consulting',
      bullets: [
        'Tech lead in five successfully delivered projects, guiding clients on the best architecture for their needs, budgets, and maturity levels; prepared documentation, wrote software, and performed code reviews.',
        "Redesigned and rewrote a legal-tech start-up's previously prohibitively slow and inaccurate search engine, allowing them to launch.",
        "Redesigned and rebuilt the data architecture and connections between a client's SAP, PIM, and e-commerce website, which allowed it to relaunch online sales.",
      ],
    },
    {
      period: 'Jun 2016 – Dec 2019',
      role: 'Backend Python/Django Engineer',
      company: 'European Public Affairs Technologies',
      sector: 'media & policy',
      bullets: [
        "Designed a serverless, multi-cloud (GCP, AWS, and DigitalOcean) architecture for a data pipeline and UI collating social media (including Twitter's Firehose) and news media (Briefed.eu) for EU lobbyists.",
        'Developed the full project (backend and frontend), including a central Django project, several serverless apps, and a text-analysis API delivered using Flask.',
        'Databases included Elasticsearch, PostgreSQL, and Redis.',
      ],
    },
  ],
  projects: [
    {
      period: 'Nov 2025 – Jan 2026',
      name: 'Savin Hood tax calculator',
      bullets: [
        'Built a UK income tax calculator — Rust and Python/Django backend, TypeScript and Astro frontend — entirely using Claude Code and Codex.',
      ],
    },
    {
      period: 'Jan 2015 – Jun 2016',
      name: 'Co-founder & Product Owner, European Public Affairs Technologies',
      bullets: [
        'Designed a content-sharing platform (thewonk.eu) for EU policy analysis, which reached 30% of the total achievable market and was recognised by ComRes as a leading source of policy analysis for EU policymakers.',
      ],
    },
  ],
  education: [
    { period: 'Apr 2026', course: 'AI Safety Bootcamp', institution: 'ML4Good' },
    {
      period: 'Sep 2024 – present',
      course: 'MSc Computer Science',
      institution: 'University of Bath',
    },
    {
      period: 'Jun 2024 – Sep 2024',
      course: 'AI Safety Fundamentals Alignment Course',
      institution: 'BlueDot Impact',
    },
    { period: 'Mar 2024 – Jun 2024', course: 'AI Programming Nanodegree', institution: 'Udacity' },
    {
      period: 'May 2021 – Oct 2021',
      course: 'Engineering Leadership',
      institution: 'Cornell University',
    },
    {
      period: '2010 – 2011',
      course: 'MSc European Public Policy',
      institution: 'University College London',
    },
    {
      period: '2006 – 2010',
      course: 'BA Russian Studies & International Relations',
      institution: 'University of Birmingham',
    },
  ],
  languages: 'English (native) | Russian (fluent) | French, Polish, and Spanish (lapsed)',
} as const;
