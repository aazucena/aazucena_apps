import { z } from 'zod';
import { PageHeaderSchema, PhaseItemSchema, CtaSectionSchema } from './components';

/**
 * Zod schema for Journey Page Configuration from Strapi CMS
 */
export const StrapiJourneySchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z.string().default('journey').optional(), // Navigation integration
  header: PageHeaderSchema.nullable().optional(),
  phases: z.array(PhaseItemSchema).optional(),
  callToAction: CtaSectionSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiJourney = z.infer<typeof StrapiJourneySchema>;