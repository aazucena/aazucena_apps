import { z } from 'zod';
import {
  ImageElementSchema,
  TagSchema,
  StatsSchema,
  SeoSchema,
  WebLinkArraySchema,
} from './components.js';
import { ProjectDisplayEnum, ProjectTypeEnum, ProjectStatusEnum } from '@aazucena/types';
import { StrapiSkillSchema } from './skills.js';
import { StrapiExperienceSchema } from './experiences.js';
import { StrapiEducationSchema } from './education.js';
import type { StrapiProject } from '@aazucena/types';

/**
 * Zod validation schema for Strapi Project content type
 */
export const StrapiProjectSchema: z.ZodType<StrapiProject> = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string().max(200),
  slug: z.string(),
  shortDescription: z.string().max(300),
  description: z.any(),
  display: ProjectDisplayEnum,
  coverImage: ImageElementSchema.nullable().optional(),
  screenshots: z.array(ImageElementSchema).nullable().optional(),
  demoVideo: z.any().nullable().optional(),
  gallery: z.array(z.any()).nullable().optional(),
  repositoryUrl: z.string().max(255).url().nullable().optional(),
  liveDemoUrl: z.string().max(255).url().nullable().optional(),
  projectType: ProjectTypeEnum.nullable().optional(),
  sort: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  projectStatus: ProjectStatusEnum.nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(),

  // Relations
  techStack: z.array(z.lazy(() => StrapiSkillSchema)).optional(),

  metrics: z.array(StatsSchema).nullable().optional(),
  seo: SeoSchema.nullable().optional(),
  relatedLinks: WebLinkArraySchema.nullable().optional(),
  experience: z
    .lazy(() => StrapiExperienceSchema)
    .nullable()
    .optional(),
  education: z
    .lazy(() => StrapiEducationSchema)
    .nullable()
    .optional(),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiProjectsResponseSchema = z.object({
  data: z.array(StrapiProjectSchema),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          pageCount: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
});

export type StrapiProjectsResponse = z.infer<typeof StrapiProjectsResponseSchema>;
