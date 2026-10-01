// CV content for the /cv/ page. Keep aligned with public/cv.pdf.
// The public versions omit the phone number in the source document.
export const cv = {
  updated: 'September 2026',
  headline: 'UK citizen',
  summary:
    'Engineering leader specialising in production Generative AI platforms and AI-augmented software delivery. I build self-service systems that let teams define, evaluate, and deploy AI products for millions of users, with the cost, safety, and operational controls needed for five-nines reliability. I also build Photoroom’s backend agentic software-development systems, combining coding agents with structured evaluation and deterministic controls, that now produce around 80% of our merged backend PRs.',
  technologies: [
    'Python, Django, FastAPI',
    'Kubernetes, Lambda',
    'Managed projects in Angular, PHP, React, Vue.js',
    'AWS, Google Cloud Platform, DigitalOcean & private data centres/on-prem',
    'Microservices, event-driven architecture, data pipelines',
    'Production applications with Claude, GPT, Gemini, Black Forest Labs, and internal AI APIs',
    'GitHub Actions, GitLab’s CI/CD',
    'SNS/SQS, custom message queues, AWS Step Functions',
    'DynamoDB, Elasticsearch, PostgreSQL, Redis',
    'Datadog, Sentry, Grafana',
  ],
  experience: [
    {
      period: 'Jul 2026 – present',
      role: 'Staff Engineer, Engineering Lead Core AI Platform',
      company: 'Photoroom',
      sector: 'AI & e-commerce',
      bullets: [
        'Designing and building the no-code, self-service platform that enables Photoroom teams to define, test, and launch generative-AI tools.',
        'Key projects: MCP server, enabling AI assistants to use its image-editing tools; resilient asynchronous execution for long-running AI generations; granular model-cost attribution, analytics, and controls; and AI-safety and content-provenance infrastructure, including child-safety safeguards, C2PA Content Credentials, and imperceptible watermarking.',
        'Manage three direct reports and lead Photoroom’s Backend Guild, setting engineering standards and best practices and promoting knowledge-sharing across all backend engineers.',
      ],
    },
    {
      period: 'Dec 2024 – Jul 2026',
      role: 'Staff Engineer, Head of Backend',
      company: 'Photoroom',
      sector: 'AI & e-commerce',
      bullets: [
        'A hands-on (65% IC) role responsible for Photoroom’s Django and FastAPI backend (2,500 requests per second, 10TB database) and managed 4 direct reports.',
        'Oversaw FastAPI AI gateway, handling frontend requests to internal and external AI endpoints, including model fallbacks, rate limiting, abuse prevention, enriching requests, and more to ensure safe and reliable model use at scale.',
        'Expanded our system monitoring (anomalies, SLOs, error rates) to improve incident detection and response times.',
        'Led migration to Kubernetes, zero-downtime deployments (including data migrations), introduced automated deployments and a testing environment for client developers to use.',
        'Tech lead for cross-platform (Android, backend, iOS, and web) redesign of our billing system to closely align users’ AI usage with the subscription fees.',
        'Built an agentic coding pipeline with structured evaluation, delivering 70–90% of merged PRs per week. An increasing majority merged without human review thanks to reference files, and deterministic checks. Pipeline monitored (incl. chain-of-thought) for optimisation.',
      ],
    },
    {
      period: 'Aug 2022 – Oct 2024',
      role: 'Staff Engineer',
      company: 'Lantum',
      sector: 'healthcare & finance',
      bullets: [
        'Planned, led, and worked on the refactor of the entire backend (Python/Django), reducing complexity, upgrading libraries, hardening security, and enabling new features.',
        'Oversaw tech support and incident response; trained the team, established reporting systems and built better monitoring and logs. Resulted in reducing exposure of feature squads from 25% of their time to less than 1%, and reduced developer churn.',
        'Established and evangelised software processes, patterns, and ways of working.',
      ],
    },
    {
      period: 'Jul 2021 – Jul 2022',
      role: 'Technical Director (CTO)',
      company: 'TrackTrack',
      sector: 'legal tech',
      bullets: [
        'Transformed the software architecture, infrastructure, team, and software development processes to allow rapid growth in clients. Some clients required on-prem deployments of our product inside their DMZ.',
      ],
    },
    {
      period: 'Nov 2019 – Jun 2021',
      role: 'Consulting Software Engineer & Architect',
      company: 'European Public Affairs Technologies',
      sector: 'consulting',
      bullets: [
        'Tech Lead in five successfully delivered projects. I guided clients on the best architecture for their needs, budgets, and maturity levels. I prepared documentation, wrote software, and performed code reviews. Notable projects included:',
      ],
    },
    {
      period: 'Jun 2016 – Dec 2019',
      role: 'Backend Python/Django Engineer',
      company: 'European Public Affairs Technologies',
      sector: 'media & policy',
      bullets: [
        'Built a content sharing platform for EU policymakers and a tool for lobbyists that compiled all the publicly available data on EU politicians.',
      ],
    },
  ],
  projects: [
    {
      name: 'Savin Hood Tax Calculator',
      description: 'Built a UK income tax calculator to help navigate the 100k tax trap.',
      url: 'https://app.savinhood.com/calculator',
    },
    {
      name: 'Zero Downtime Migrations',
      description: 'PostgreSQL migration safety linter for Alembic, Django, and Tortoise.',
      url: 'https://github.com/Photoroom/zero-downtime-migrations',
    },
  ],
  blogs: [
    { title: 'What are PR reviews good for anyway?', url: '/blog/what-are-pr-reviews-good-for-anyway/' },
    {
      title: 'Senior Claude reviewer is not a good use of engineering talent',
      url: '/blog/senior-claude-reviewer-is-not-a-good-use-of-engineering-talent/',
    },
    {
      title: 'The laptop is the wrong place to run coding agents',
      url: '/blog/the-laptop-is-the-wrong-place-to-run-coding-agents/',
    },
  ],
  education: [
    { period: 'Apr 2026', course: 'AI Safety Bootcamp', institution: 'ML4Good' },
    { period: 'Sep 2024 – present', course: 'MSc Computer Science', institution: 'University of Bath' },
    { period: 'Jun 2024 – Sep 2024', course: 'AI Safety Fundamentals Alignment Course', institution: 'BlueDot Impact' },
    { period: 'Mar 2024 – Jun 2024', course: 'AI Programming Nanodegree', institution: 'Udacity' },
    { period: 'May 2021 – Oct 2021', course: 'Engineering Leadership', institution: 'Cornell University' },
    { period: '2010 – 2011', course: 'MSc European Public Policy', institution: 'University College London' },
    { period: '2006 – 2010', course: 'BA Russian Studies & International Relations', institution: 'University of Birmingham' },
  ],
} as const;
