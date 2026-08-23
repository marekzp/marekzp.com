import { LinkChecker } from 'linkinator';

const result = await new LinkChecker().check({
  path: './dist',
  port: 4174,
  recurse: true,
  linksToSkip: ['^https?://(?!localhost)'],
});

const brokenLinks = result.links.filter(({ state }) => state === 'BROKEN');
for (const { url } of brokenLinks) console.error(`Broken link: ${url}`);
if (brokenLinks.length) process.exitCode = 1;
