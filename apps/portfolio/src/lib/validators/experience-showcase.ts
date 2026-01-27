import { z } from 'zod';
import { PageHeaderSchema } from './components';

/**
 * Zod schema for Experience Showcase Configuration from Strapi CMS
 */
export const StrapiExperienceShowcaseSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  header: PageHeaderSchema.nullable().optional(),
  searchPlaceholder: z.string().default('Search by skills, company, or result...'),
  listPagePath: z.string().default('experiences').optional(), // Navigation integration
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiExperienceShowcase = z.infer<typeof StrapiExperienceShowcaseSchema>;