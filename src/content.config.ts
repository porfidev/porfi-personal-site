import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['es', 'en']),
    translationKey: z.string().optional(),
    slug: z.string().optional(),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['feature', 'fix', 'content', 'design', 'maintenance']),
    lang: z.enum(['es', 'en']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, changelog };
