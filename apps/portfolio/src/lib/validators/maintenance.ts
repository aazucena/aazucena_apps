import { z } from 'zod';

/**
 * Zod schema for Maintenance Mode from Strapi CMS
 */
export const StrapiMaintenanceSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  enabled: z.boolean(),
  message: z.any(), // Rich text field (can be string or structured data)
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiMaintenance = z.infer<typeof StrapiMaintenanceSchema>;
