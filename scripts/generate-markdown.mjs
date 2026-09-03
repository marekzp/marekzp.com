import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDirectory = 'src/content/blog';
const destinationDirectory = 'dist/markdown/blog';
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const field = (frontmatter, name) => frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim();

for (const filename of await readdir(sourceDirectory)) {
  if (!filename.endsWith('.md')) continue;

  const source = await readFile(join(sourceDirectory, filename), 'utf8');
  const [, frontmatter, body] = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? [];
  if (!frontmatter || !body || field(frontmatter, 'draft') === 'true') continue;

  const title = field(frontmatter, 'title');
  const description = field(frontmatter, 'description');
  const published = field(frontmatter, 'pubDate');
  if (!title || !description || !published) throw new Error(`Missing Markdown metadata in ${filename}`);

  const updated = field(frontmatter, 'updatedDate');
  const original = frontmatter.match(/^original:\r?\n\s+venue:\s*(.+)\r?\n\s+url:\s*(.+)$/m);
  const slug = filename.slice(0, -3);
  const markdown = [
    `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\ndate: ${published}\nurl: https://marekzp.com/blog/${slug}/\n---`,
    `# ${title}`,
    `Published ${date.format(new Date(`${published}T00:00:00Z`))}${updated ? `; updated ${date.format(new Date(`${updated}T00:00:00Z`))}.` : '.'}`,
    ...(original ? [`Originally published on [${original[1]}](${original[2]}).`] : []),
    body.trim(),
  ].join('\n\n');

  const outputDirectory = join(destinationDirectory, slug);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, 'index.md'), `${markdown}\n`);
}
