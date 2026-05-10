import { z } from 'zod';
import { ServiceCategoryEnum } from '@aazucena/types';

const StrapiCtaButtonSchema = z.object({
  id: z.number().optional(),
  label: z.string().max(50),
  url: z.string().max(255),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  openInNewTab: z.boolean().default(true),
  icon: z.any().nullable().optional(),
});

export const StrapiServiceSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  title: z.string(),
  category: ServiceCategoryEnum,
  shortDescription: z.string().nullable().optional(),
  description: z.any().nullable().optional(), // richtext → Markdown string

  icon: z.any().nullable().optional(), // plugin::icons-field.icon outputFormat:"svg"
  features: z.array(z.string()).default([]), // sortable-list plugin → string[]
  price: z.string().nullable().optional(),
  cta: StrapiCtaButtonSchema.nullable().optional(),

  sort: z.number().int().default(1),
  enable: z.boolean().nullable().default(true),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
});

export const StrapiServicesResponseSchema = z.object({
  data: z.array(StrapiServiceSchema),
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

export type StrapiService = z.infer<typeof StrapiServiceSchema>;
export type StrapiServicesResponse = z.infer<typeof StrapiServicesResponseSchema>;
