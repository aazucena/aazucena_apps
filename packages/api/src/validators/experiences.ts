import { z } from 'zod';
import { ImageElementSchema, AchievementSchema, WebLinkArraySchema } from './components.js';
import { IndustryEnum, CompanySizeEnum, EmploymentTypeEnum, WorkModeEnum } from '@aazucena/types';
import { StrapiSkillSchema } from './skills.js';
import { StrapiProjectSchema } from './projects.js';
import type { StrapiExperience } from '@aazucena/types';

export const StrapiExperienceSchema: z.ZodType<StrapiExperience> = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  // Core fields
  company: z.string().max(150),
  position: z.string().max(150),
  companyLogo: ImageElementSchema.nullable().optional(),

  // Company metadata
  industry: IndustryEnum.optional(),
  companySize: CompanySizeEnum.optional(),
  location: z.string().max(150).optional(),

  // Date fields
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),

  // Content fields
  description: z.any(),
  responsibilities: z.any().optional(),

  // Employment details
  employmentType: EmploymentTypeEnum.optional(),
  workMode: WorkModeEnum.optional(),
  companyWebsite: z.string().max(255).nullable().optional(),
  companyLinkedIn: z.string().max(255).nullable().optional(),

  // Relations
  skillsUsed: z.array(z.lazy(() => StrapiSkillSchema)).optional(),
  achievements: z.array(AchievementSchema).optional(),
  projects: z.array(z.lazy(() => StrapiProjectSchema)).optional(),
  relatedLinks: WebLinkArraySchema.nullable().optional(),

  // Metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiExperiencesResponseSchema = z.object({
  data: z.array(StrapiExperienceSchema),
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

export type StrapiExperiencesResponse = z.infer<typeof StrapiExperiencesResponseSchema>;
