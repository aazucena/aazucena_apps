import { z } from 'zod';

/**
 * Zod schema for Project Showcase Configuration from Strapi CMS
 */
export const StrapiShowcaseSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  dragHintText: z.string().max(100),
  viewMoreButtonLabel: z.string().max(50),
  viewMoreButtonSubtitle: z.string().max(100),
  maxProjectsDisplayed: z.number().min(1).max(20),
  projectsPerPage: z.number().min(1).max(8),
  projectsListPagePath: z.string().max(200).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiShowcase = z.infer<typeof StrapiShowcaseSchema>;
