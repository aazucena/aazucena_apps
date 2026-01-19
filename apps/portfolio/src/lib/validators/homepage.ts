import { z } from 'zod';

/**
 * Zod schema for a single section component
 */
export const SectionSchema = z.object({
  id: z.number(),
  enabled: z.boolean(),
  name: z.string().max(100),
  title: z.string().max(255),
  subtitle: z.string().max(255).nullable().optional(),
  buttonLabel: z.string().max(255).nullable().optional(),
  icon: z.any().optional(), // Icon picker custom field
  sort: z.number().nullable().optional(),
});

// Schema for shared.seo component
const SEOSchema = z.object({
  id: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalURL: z.string().optional(),
  metaRobots: z.string().optional(),
  openGraph: z.any().optional(), // nested openGraph component
}).nullable().optional();

/**
 * Zod schema for Homepage from Strapi CMS
 */
export const StrapiHomepageSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // NEW: Homepage title field
  title: z.string().max(100), // Required in CMS

  // Sections configuration
  sections: z.array(SectionSchema).min(1).max(8),

  // NEW: SEO component
  seo: SEOSchema,

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiHomepage = z.infer<typeof StrapiHomepageSchema>;
export type Section = z.infer<typeof SectionSchema>;
