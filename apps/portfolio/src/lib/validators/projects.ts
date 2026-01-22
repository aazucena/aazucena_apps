import { z } from 'zod';
import { WebLinkArraySchema } from './web-link';
import { StrapiSkillSchema } from './skills';

/**
 * Image element component schema
 */
const ImageElementSchema = z.object({
  id: z.number().optional(),
  src: z.any(), // StrapiMedia
  altText: z.string(),
}).nullable().optional();

/**
 * Tag component schema
 */
const TagSchema = z.object({
  id: z.number().optional(),
  label: z.string().max(30),
  color: z.enum(['cyan', 'blue', 'purple', 'pink', 'green', 'teal', 'orange', 'red', 'gray']),
});

/**
 * Stats/Metrics component schema
 */
const StatsSchema = z.object({
  id: z.number().optional(),
  label: z.string(),
  value: z.string(),
  icon: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

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
  coverImage: ImageElementSchema,
  screenshots: z.array(ImageElementSchema).nullable().optional(),
  demoVideo: z.any().nullable().optional(), // StrapiMedia
  gallery: z.array(z.any()).nullable().optional(), // Array of StrapiMedia
  repositoryUrl: z.string().max(255).url().nullable().optional(),
  liveDemoUrl: z.string().max(255).url().nullable().optional(),
  projectType: z.enum(['Web App', 'Mobile App', 'Desktop App', 'Library', 'API', 'CLI Tool', 'Game', 'Music Production', 'Hardware/Embedded']).nullable().optional(),
  sort: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(), // ISO date string
  endDate: z.string().nullable().optional(), // ISO date string
  projectStatus: z.enum(['Planned', 'In Progress', 'Released', 'Maintenance', 'On Hold', 'Completed', 'Archived']).nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(), // Repeatable tag components
  techStack: z.array(StrapiSkillSchema).optional(), // Skills relation (raw Strapi format)
  metrics: z.array(StatsSchema).nullable().optional(), // Repeatable stats components
  seo: z.any().nullable().optional(), // SEO component

  // New fields (Phase 0.5)
  relatedLinks: WebLinkArraySchema, // Repeatable web-link components
  experience: z.object({
    id: z.number(),
    documentId: z.string().optional(),
    position: z.string(),
    company: z.string(),
  }).nullable().optional(), // ManyToOne relation to Experience
  education: z.object({
    id: z.number(),
    documentId: z.string().optional(),
    degree: z.string(),
    institution: z.string(),
  }).nullable().optional(), // ManyToOne relation to Education

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
