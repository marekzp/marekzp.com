import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { homeMarkdown } from '../markdown';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return new Response(homeMarkdown(posts), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
