import { z } from 'zod';
import { SectionSchema, SeoSchema } from './components';

export type { Section } from './components';

/**
 * Zod schema for Homepage from Strapi CMS
 */
export const StrapiHomepageSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  title: z.string().max(100),
  sections: z.array(SectionSchema).min(1).max(8),
  seo: SeoSchema,

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiHomepage = z.infer<typeof StrapiHomepageSchema>;
