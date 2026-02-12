import { z } from 'zod';
import { SeoSchema, StrapiMediaSchema } from './components.js';

/**
 * Zod schema for Tech Stack item
 */
export const TechStackSchema = z.object({
  id: z.number().optional(),
  name: z.string().max(50),
  icon: z.any().nullable().optional(), // icons-field plugin
  iconTitle: z.string().max(100),
  iconUrl: z.string().url().max(255).nullable().optional(),
  sort: z.number().default(0),
});

export type TechStackItem = z.infer<typeof TechStackSchema>;

/**
 * Zod schema for Website Configuration from Strapi CMS
 */
export const StrapiWebsiteConfigSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  siteName: z.string().max(100),
  siteUrl: z.string().max(200),
  siteTagline: z.string().max(200).nullable().optional(),
  baseUrl: z.string().max(50).default('/'),
  siteLogo: StrapiMediaSchema.nullable().optional(),
  favicon: StrapiMediaSchema.nullable().optional(),
  defaultSEO: SeoSchema,
  metaTitleTemplate: z.string().max(100).default('%s — {siteName}'),
  openGraphSiteName: z.string().max(100).nullable().optional(),
  twitterHandle: z.string().max(50).nullable().optional(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  googleSiteVerificationId: z.string().max(100).nullable().optional(),
  trailingSlash: z.boolean().default(false),
  cleanUrls: z.boolean().default(true),
  // Footer configuration
  footerBrandDescription: z.string().max(500).nullable().optional(),
  footerLocationTagline: z.string().max(200).nullable().optional(),
  footerBuiltWithLabel: z.string().max(50).default('Built with'),
  techStack: z.array(TechStackSchema).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiWebsiteConfig = z.infer<typeof StrapiWebsiteConfigSchema>;
