import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    lane: z.enum(['professional', 'personal']),
    featured: z.boolean().default(false),
    status: z
      .enum(['completed', 'in-progress', 'archived'])
      .default('completed'),
    startDate: z.string().regex(
      /^(\d{4}-(0[1-9]|1[0-2])|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})$/,
      'Use YYYY-MM or Mon YYYY format for startDate.',
    ),
    endDate: z.string().regex(
      /^((\d{4}-(0[1-9]|1[0-2]))|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})|present)$/i,
      'Use YYYY-MM, Mon YYYY, or "present" for endDate.',
    ),
    stack: z.array(z.string()).min(1),
    impact: z.array(z.string()).min(1),
    links: z
      .object({
        github: z.url().optional(),
        live: z.url().optional(),
        caseStudy: z.url().optional(),
      })
      .refine(
        (entryLinks) =>
          Boolean(entryLinks.github || entryLinks.live || entryLinks.caseStudy),
        {
          message:
            'Provide at least one link in links.github, links.live, or links.caseStudy.',
        },
      ),
  }),
});

export const collections = {
  projects,
};
