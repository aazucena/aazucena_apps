import { z } from 'zod';

/**
 * Zod schema for Stats component
 */
export const StatsSchema = z.object({
  id: z.number(),
  label: z.string().max(50),
  value: z.string().max(20),
  description: z.string().max(100).nullish(),
  icon: z.any().nullish(), // Icon picker custom field
  sort: z.number().nullish(),
});

/**
 * Zod schema for CTA Button component
 */
export const CTAButtonSchema = z.object({
  id: z.number(),
  label: z.string(),
  url: z.string().optional(),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  icon: z.any().optional(),
});

/**
 * Zod schema for Card Link component
 */
export const CardLinkSchema = z.object({
  id: z.number(),
  title: z.string().max(100),
  variant: z.enum(['cyan-blue', 'purple-pink', 'green-teal', 'orange-red', 'indigo-violet']).optional(),
  description: z.string().max(255).optional(),
  icon: z.any().optional(),
  button: CTAButtonSchema,
});

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
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiAbout = z.infer<typeof StrapiAboutSchema>;
export type Stats = z.infer<typeof StatsSchema>;
export type CardLink = z.infer<typeof CardLinkSchema>;
