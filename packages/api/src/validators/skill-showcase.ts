import { z } from 'zod';
import { PageHeaderSchema } from './components.js';

/**
 * Zod schema for Skill Showcase Configuration from Strapi CMS
 */
export const StrapiSkillShowcaseSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  header: PageHeaderSchema.nullable().optional(),
  highlyUsedThreshold: z.number().default(3),
  searchPlaceholder: z.string().default('Search technologies (e.g. React, PostgreSQL)...'),
  emptyMessage: z.string().default('No technologies found matching your criteria.'),
  taxonomyPagePath: z.string().default('skills').optional(), // Navigation integration
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiSkillShowcase = z.infer<typeof StrapiSkillShowcaseSchema>;
