import { z } from 'zod';

/**
 * Zod schema for Hero Section from Strapi CMS
 */
export const StrapiHeroSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  flipWords: z.any(), // Sortable list custom field (array of strings)
  taglineTemplate: z.string().max(200),
  primaryButtonText: z.string().max(50).optional(),
  showDropdown: z.boolean().optional(),
  secondaryButtonText: z.string().max(50).optional(),
  showSecondaryButton: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiHero = z.infer<typeof StrapiHeroSchema>;
