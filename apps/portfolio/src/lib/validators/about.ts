import { z } from 'zod';
import {
  StatsSchema,
  CardLinkSchema,
  FocusAreaSchema,
  NarrativeItemSchema,
  WorkflowItemSchema,
  LanguageItemSchema,
  WorkingStyleItemSchema
} from './components';

export type { Stats, CardLink } from './components';

/**
 * Zod schema for About Section from Strapi CMS
 */
export const StrapiAboutSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  tagline: z.string().max(150),
  descriptions: z.any(), // Blocks content
  highlights: z.any(), // Blocks content
  stats: z.array(StatsSchema).optional(),
  learnMoreCards: z.array(CardLinkSchema).optional(),
  
  // Managed content fields
  focusAreas: z.array(FocusAreaSchema).optional(),
  roots: z.array(NarrativeItemSchema).optional(),
  interests: z.array(NarrativeItemSchema).optional(),
  coreValues: z.array(NarrativeItemSchema).optional(),
  workflow: z.array(WorkflowItemSchema).optional(),
  languages: z.array(LanguageItemSchema).optional(),
  workingStyle: z.array(WorkingStyleItemSchema).optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiAbout = z.infer<typeof StrapiAboutSchema>;