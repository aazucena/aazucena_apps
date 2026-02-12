import { z } from 'zod';
import { ImageElementSchema, TagSchema, SeoSchema, WebLinkArraySchema } from './components.js';
import { PostStatusEnum } from '@aazucena/types';

export const StrapiPostSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  title: z.string().max(200),
  slug: z.string(),
  description: z.any(), // richtext field

  // Media
  coverImage: ImageElementSchema.nullable().optional(),

  // Status & Display
  status: PostStatusEnum.optional(),
  sort: z.number().min(0).optional(),
  featured: z.boolean().default(false),

  // URLs
  url: z.string().max(255),
  isExternal: z.boolean().default(false),

  // Taxonomy
  tags: z.array(TagSchema).optional(),

  // SEO
  seo: SeoSchema,

  // Relations
  relatedLinks: WebLinkArraySchema,

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiPostsResponseSchema = z.object({
  data: z.array(StrapiPostSchema),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          pageCount: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
});

export type StrapiPost = z.infer<typeof StrapiPostSchema>;
export type StrapiPostsResponse = z.infer<typeof StrapiPostsResponseSchema>;
