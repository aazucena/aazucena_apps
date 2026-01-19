import { z } from 'zod';

/**
 * Zod validation schema for Strapi Project content type
 */
export const StrapiProjectSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string().max(200),
  slug: z.string(),
  shortDescription: z.string().max(300),
  description: z.any(), // Richtext/Blocks
  display: z.enum(['hidden', 'unlisted', 'standard', 'featured', 'home']),
  coverImage: z.object({
    src: z.any(), // StrapiMedia
    altText: z.string(),
  }).nullable().optional(),
  screenshots: z.array(z.object({
    src: z.any(),
    altText: z.string(),
  })).nullable().optional(),
  demoVideo: z.any().nullable().optional(),
  gallery: z.array(z.any()).nullable().optional(),
  repositoryUrl: z.string().max(255).url().nullable().optional(),
  liveDemoUrl: z.string().max(255).url().nullable().optional(),
  projectType: z.enum(['Web App', 'Mobile App', 'Desktop App', 'Library', 'API', 'CLI Tool', 'Game', 'Music Production', 'Hardware/Embedded']).nullable().optional(),
  sort: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  projectStatus: z.enum(['Planned', 'In Progress', 'Released', 'Maintenance', 'On Hold', 'Completed', 'Archived']).nullable().optional(),
  tags: z.string().nullable().optional(), // Comma-separated string
  techStack: z.array(z.any()).nullable().optional(), // Skills relation
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
  })).nullable().optional(),
  seo: z.any().nullable().optional(),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiProjectsResponseSchema = z.object({
  data: z.array(StrapiProjectSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiProject = z.infer<typeof StrapiProjectSchema>;
export type StrapiProjectsResponse = z.infer<typeof StrapiProjectsResponseSchema>;
