import { z } from 'zod';
import { StrapiMediaSchema } from './components.js';
import { AwardTypeEnum, AwardCategoryEnum } from '@aazucena/types';

export const StrapiAwardSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  type: AwardTypeEnum.default('award'),
  title: z.string().max(200),
  shortTitle: z.string().max(50).optional().nullable(),
  organization: z.string().max(150),
  issuer: z.string().max(150).optional().nullable(),
  year: z.number().int().min(1900).max(2100),
  credentialId: z.string().max(100).optional().nullable(),

  // Content
  description: z.any().optional().nullable(), // Richtext
  category: AwardCategoryEnum.optional().nullable(),

  // URLs & Media
  verificationUrl: z.string().max(255).optional().nullable(),
  badge: StrapiMediaSchema.nullable().optional(),
  certificate: StrapiMediaSchema.nullable().optional(),

  // Meta
  featured: z.boolean().default(false),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiAwardsResponseSchema = z.object({
  data: z.array(StrapiAwardSchema),
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

export type StrapiAward = z.infer<typeof StrapiAwardSchema>;
export type StrapiAwardsResponse = z.infer<typeof StrapiAwardsResponseSchema>;
