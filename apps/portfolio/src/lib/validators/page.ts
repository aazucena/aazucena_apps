import { z } from 'zod';

// Import SEO schema (assuming it exists)
export const SeoSchema = z.object({
  id: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalURL: z.string().nullable().optional(),
  metaRobots: z.string().optional(),
  openGraph: z.any().optional(), // nested component
}).nullable().optional();

export const PageSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z.string().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().max(200),
  content: z.any(), // Richtext content
  template: z.enum(['legal', 'default', 'landing']),
  lastUpdated: z.string(), // ISO date string
  seo: SeoSchema,
  showTableOfContents: z.boolean().default(true),
  footerVariant: z.enum(['default', 'minimal']).default('minimal'),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiPage = z.infer<typeof PageSchema>;
