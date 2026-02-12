import { z } from 'zod';
import { PageHeaderSchema } from './components.js';

/**
 * Zod schema for Project Showcase Configuration from Strapi CMS
 */
export const StrapiShowcaseSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  header: PageHeaderSchema.nullable().optional(),
  searchPlaceholder: z.string().default('Search projects by tech, title...'),
  dragHintText: z.string().max(100),
  viewMoreButtonLabel: z.string().max(50),
  viewMoreButtonSubtitle: z.string().max(100),
  maxProjectsDisplayed: z.number().min(1).max(20),
  projectsPerPage: z.number().min(1).max(8),
  listPagePath: z.string().default('projects').optional(), // Navigation integration (renamed from projectsListPagePath)
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiShowcase = z.infer<typeof StrapiShowcaseSchema>;
