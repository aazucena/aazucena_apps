import { z } from 'zod';

export const StrapiAwardSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  type: z.enum(['certification', 'award']).default('award'),
  title: z.string().max(200),
  shortTitle: z.string().max(50).optional(),
  organization: z.string().max(150), // CHANGED: max 150 to match CMS
  issuer: z.string().max(150).optional(), // CHANGED: max 150 to match CMS
  year: z.number().int().min(1900).max(2100), // CHANGED: from string to number
  credentialId: z.string().max(100).optional(),

  // Content
  description: z.any().optional(), // Richtext field
  category: z
    .enum([
      'Academic',
      'Professional',
      'Community',
      'Music',
      'Design',
      'Certification',
      'Competition',
    ])
    .optional(),

  // URLs & Media
  verificationUrl: z.string().max(255).optional(), // RENAMED: from credentialUrl
  badge: z.any().optional(), // Media field (image)
  certificate: z.any().optional(), // NEW: Media field (image/file)

  // Meta
  featured: z.boolean().default(false), // NEW: featured flag

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiAwardsResponseSchema = z.object({
  data: z.array(StrapiAwardSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiAward = z.infer<typeof StrapiAwardSchema>;
export type StrapiAwardsResponse = z.infer<typeof StrapiAwardsResponseSchema>;
