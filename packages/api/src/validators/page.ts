import { z } from 'zod';
import { SeoSchema } from './components';
import { PageTemplateEnum, FooterVariantEnum } from '@aazucena/types';

export const PageSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z
    .string()
    .max(100)
    // eslint-disable-next-line security/detect-unsafe-regex
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().max(200),
  content: z.any(), // Blocks/Richtext
  template: PageTemplateEnum,
  lastUpdated: z.string(), // ISO date string
  seo: SeoSchema,
  showTableOfContents: z.boolean().default(true),
  footerVariant: FooterVariantEnum.default('minimal'),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiPage = z.infer<typeof PageSchema>;
