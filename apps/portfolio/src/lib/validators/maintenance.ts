import { z } from 'zod';

/**
 * Zod schema for Maintenance Mode from Strapi CMS
 */
export const StrapiMaintenanceSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  enabled: z.boolean(),
  message: z.any(),
  
  // Managed UI fields
  heroSubtitle: z.string().default('Refining the Experience'),
  reachOutLabel: z.string().default('Reach out directly'),

  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiMaintenance = z.infer<typeof StrapiMaintenanceSchema>;
