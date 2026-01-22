import { z } from 'zod';

// Schema for ui.image-element component
const ImageElementSchema = z.object({
  id: z.number().optional(),
  src: z.any().optional(), // Media field
  altText: z.string().optional(),
}).nullable().optional();

// Schema for ui.tag component
const TagSchema = z.object({
  id: z.number().optional(),
  label: z.string(),
  color: z.string().optional(),
});

// Schema for shared.seo component
const SEOSchema = z.object({
  id: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalURL: z.string().optional(),
  metaRobots: z.string().optional(),
  openGraph: z.any().optional(), // nested component
}).nullable().optional();

import { WebLinkArraySchema } from './web-link';

export const StrapiPostSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  title: z.string().max(200), // CHANGED: max 200 to match CMS
  slug: z.string(),
  description: z.any(), // CHANGED: richtext field (required in CMS)

  // Media
  coverImage: ImageElementSchema, // CHANGED: ui.image-element component

  // Status & Display
  status: z.enum(['Planned', 'In Progress', 'Completed', 'On Hold']).optional(), // NEW
  sort: z.number().min(0).optional(), // NEW
  featured: z.boolean().default(false), // Moved from optional to default

  // URLs
  url: z.string().max(255), // NEW - required
  isExternal: z.boolean().default(false), // NEW

  // Taxonomy
  tags: z.array(TagSchema).optional(), // CHANGED: ui.tag component

  // SEO
  seo: SEOSchema, // NEW - shared.seo component

  // Relations
  relatedLinks: WebLinkArraySchema, // NEW

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiPostsResponseSchema = z.object({
  data: z.array(StrapiPostSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiPost = z.infer<typeof StrapiPostSchema>;
export type StrapiPostsResponse = z.infer<typeof StrapiPostsResponseSchema>;
