import { z } from 'zod';

/**
 * Zod schema for Analytics & Monitoring from Strapi CMS
 */
export const StrapiAnalyticSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  googleAnalyticsEnabled: z.boolean().default(false),
  googleAnalyticsId: z.string().max(50).optional().nullable(),
  vercelAnalyticsEnabled: z.boolean().default(true),
  vercelSpeedInsightsEnabled: z.boolean().default(true),
  plausibleEnabled: z.boolean().default(false),
  plausibleDomain: z.string().max(200).optional().nullable(),
  sentryEnabled: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiAnalytic = z.infer<typeof StrapiAnalyticSchema>;
