import { z } from "zod";

/**
 * Zod schema for Hero Section from Strapi CMS
 */
export const StrapiHeroSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  flipWords: z.array(z.string()), // plugin::strapi-plugin-sortable-list.sortable-list
  taglineTemplate: z.string().max(200),
  primaryButtonText: z.string().max(50).optional().nullable(),
  showDropdown: z.boolean().default(true),
  secondaryButtonText: z.string().max(50).optional().nullable(),
  showSecondaryButton: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiHero = z.infer<typeof StrapiHeroSchema>;
