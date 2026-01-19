import { z } from 'zod';

/**
 * Zod schema for Theme & Branding from Strapi CMS
 */
export const StrapiThemeSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  mode: z.enum(['system', 'light', 'dark', 'light:only', 'dark:only']),
  primaryColor: z.any(), // Color picker custom field (hex color)
  primaryColorDark: z.any(),
  secondaryColor: z.any(),
  secondaryColorDark: z.any(),
  accentColor: z.any(),
  accentColorDark: z.any(),
  fontSans: z.string().max(100).optional(),
  fontSerif: z.string().max(100).optional(),
  fontHeading: z.string().max(100).optional(),
  fontCode: z.string().max(100).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiTheme = z.infer<typeof StrapiThemeSchema>;
