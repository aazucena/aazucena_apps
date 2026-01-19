import { z } from 'zod';

/**
 * Zod schema for Blog Configuration from Strapi CMS
 */
export const StrapiBlogConfigSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  postsPerPage: z.number().min(1).max(50),
  permalink: z.string().max(100),
  mainPath: z.string().max(50),
  categoryPath: z.string().max(50),
  tagPath: z.string().max(50),
  relatedPostsEnabled: z.boolean(),
  relatedPostsCount: z.number().min(1).max(10).optional(),
  displayPostsCount: z.number().min(1).max(12),
  gridColumns: z.number().min(1).max(4),
  viewAllButtonText: z.string().max(50),
  viewAllButtonAriaLabel: z.string().max(100),
  showViewAllButton: z.boolean(),
  showTags: z.boolean(),
  showDate: z.boolean(),
  showReadTime: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiBlogConfig = z.infer<typeof StrapiBlogConfigSchema>;
