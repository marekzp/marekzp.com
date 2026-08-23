import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    // For posts first published elsewhere: emits rel=canonical to the
    // original and a visible attribution line on the post page.
    original: z
      .object({
        venue: z.string(),
        url: z.url(),
      })
      .optional(),
  }),
});

export const collections = { blog };
