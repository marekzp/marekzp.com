import type { APIRoute } from 'astro';
import { cvMarkdown } from '../markdown';

export const GET: APIRoute = () =>
  new Response(cvMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
