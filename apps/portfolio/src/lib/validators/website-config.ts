import { z } from 'zod';

/**
 * Zod schema for Open Graph component
 */
export const OpenGraphSchema = z.object({
  id: z.number(),
  ogTitle: z.string().max(70),
  ogDescription: z.string().max(200),
  ogImage: z.any().optional(), // Media field
  ogUrl: z.string().max(500).optional(),
  ogType: z.enum(['website', 'article', 'profile']).optional(),
});

/**
 * Zod schema for SEO component
 */
export const SEOSchema = z.object({
  id: z.number(),
  metaTitle: z.string().max(60),
  metaDescription: z.string().min(50).max(160),
  metaImage: z.any().optional(), // Media field
  openGraph: OpenGraphSchema.nullable().optional(),
  keywords: z.string().max(500).nullable().optional(),
  metaRobots: z.enum(['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow']).nullable().optional(),
  metaViewport: z.string().max(200).nullable().optional(),
  canonicalURL: z.string().max(500).nullable().optional(),
  structuredData: z.any().optional(), // JSON field
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).nullable().optional(),
});

/**
 * Zod schema for Website Configuration from Strapi CMS
 */
export const StrapiWebsiteConfigSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  siteName: z.string().max(100),
  siteUrl: z.string().max(200),
  siteTagline: z.string().max(200).nullable().optional(),
  baseUrl: z.string().max(50).nullable().optional(),
  siteLogo: z.any().optional(), // Media field
  favicon: z.any().optional(), // Media field
  defaultSEO: SEOSchema,
  metaTitleTemplate: z.string().max(100).nullable().optional(),
  openGraphSiteName: z.string().max(100).nullable().optional(),
  twitterHandle: z.string().max(50).nullable().optional(),
  robotsIndex: z.boolean().nullable().optional(),
  robotsFollow: z.boolean().nullable().optional(),
  googleSiteVerificationId: z.string().max(100).nullable().optional(),
  trailingSlash: z.boolean().nullable().optional(),
  cleanUrls: z.boolean().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiWebsiteConfig = z.infer<typeof StrapiWebsiteConfigSchema>;
export type SEO = z.infer<typeof SEOSchema>;
export type OpenGraph = z.infer<typeof OpenGraphSchema>;
