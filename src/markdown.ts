import type { CollectionEntry } from 'astro:content';
import { cv } from './cv';
import { formatDate } from './dates';
import { site } from './site';

type Post = CollectionEntry<'blog'>;

const frontmatter = (fields: Record<string, string>) =>
  `---\n${Object.entries(fields)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n')}\n---`;

const postList = (posts: Post[]) =>
  posts
    .map(
      (post) =>
        `- [${post.data.title}](${site.url}/blog/${post.id}/) — ${formatDate(post.data.pubDate)}\n  ${post.data.description}`
    )
    .join('\n');

export const homeMarkdown = (posts: Post[]) =>
  [
    frontmatter({ title: `${site.name}, ${site.jobTitle}`, description: site.description, url: site.url }),
    `# ${site.name}`,
    `${site.jobTitle} at [${site.employer.name}](${site.employer.url})`,
    'Engineering leader specialising in production Generative AI platforms and AI-augmented software delivery.',
    '## Writing',
    postList(posts),
    '## Projects',
    ...site.projects.map((project) => `- [${project.name}](${project.url}) — ${project.description}`),
    '## Elsewhere',
    `- [GitHub](${site.profiles.github})\n- [LinkedIn](${site.profiles.linkedin})\n- [Substack](${site.profiles.substack})\n- ${site.email}`,
  ].join('\n\n');

export const blogMarkdown = (posts: Post[]) =>
  [
    frontmatter({
      title: `Blog — ${site.name}`,
      description: 'Posts on backend engineering, production AI systems, and agentic coding.',
      url: `${site.url}/blog/`,
    }),
    '# Blog',
    postList(posts),
  ].join('\n\n');

export const cvMarkdown = () =>
  [
    frontmatter({ title: `CV — ${site.name}`, description: cv.summary, url: `${site.url}/cv/` }),
    '# Curriculum vitae',
    `${site.name}, MBCS · ${site.email} · ${site.url} · ${cv.headline} · updated ${cv.updated}`,
    cv.summary,
    '## Technologies',
    ...cv.technologies.map((technology) => `- ${technology}`),
    '## Recent work experience',
    ...cv.experience.flatMap((job) => [
      `### ${job.role} at ${job.company} (${job.period})`,
      ...job.bullets.map((bullet) => `- ${bullet}`),
    ]),
    '## Example personal projects',
    ...cv.projects.flatMap((project) => [
      `### ${project.name}`,
      project.description,
      project.url,
    ]),
    '## Recent blogs',
    ...cv.blogs.map((blog) => `- [${blog.title}](${site.url}${blog.url})`),
    '## Education',
    ...cv.education.map((entry) => `- ${entry.course}, ${entry.institution} (${entry.period})`),
  ].join('\n\n');
