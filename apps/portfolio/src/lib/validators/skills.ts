import { z } from 'zod';
import { StrapiSkillCategorySchema } from './skill-category';
import { SkillDisplayEnum, SkillProficiencyEnum } from './enums';

// Import related schemas for reference in z.lazy()
import { StrapiExperienceSchema } from './experiences';
import { StrapiProjectSchema } from './projects';
import { StrapiEducationSchema } from './education';

/**
 * Explicit Interfaces for recursive types
 */
export interface StrapiSkill {
  id?: number | null;
  documentId?: string | null;
  name: string;
  display: 'hidden' | 'standard' | 'featured' | 'core';
  category: any; 
  proficiency: 'learning' | 'competent' | 'proficient' | 'expert';
  icon?: string | null;
  description?: string | null;
  yearsOfExperience?: number | null;
  documentationUrl?: string | null;
  sort?: number | null;
  lastUsed?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  experiences?: any[]; 
  projects?: any[];
  education?: any[];
}

/**
 * Zod validation schema for Strapi Skill content type
 * Uses explicit type annotation to handle recursion via z.lazy()
 */
export const StrapiSkillSchema: z.ZodType<StrapiSkill> = z.object({
  id: z.number().nullable().optional(),
  documentId: z.string().nullable().optional(),
  name: z.string().max(100),
  display: SkillDisplayEnum,

  // Relation to category
  category: StrapiSkillCategorySchema,

  proficiency: SkillProficiencyEnum,
  icon: z.string().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  yearsOfExperience: z.number().min(0).max(50).nullable().optional(),
  documentationUrl: z.string().max(2048).url().nullable().optional(),
  sort: z.number().nullable().optional(),
  lastUsed: z.string().nullable().optional(), // ISO date string

  // Strapi metadata
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  
  // Relations - using lazy to handle deep nesting/circles
  experiences: z.array(z.lazy(() => StrapiExperienceSchema)).optional(),
  projects: z.array(z.lazy(() => StrapiProjectSchema)).optional(),
  education: z.array(z.lazy(() => StrapiEducationSchema)).optional(),
});

/**
 * Zod schema for Strapi collection response with Skills array
 */
export const StrapiSkillsResponseSchema = z.object({
  data: z.array(StrapiSkillSchema),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      pageCount: z.number(),
      total: z.number(),
    }).optional(),
  }).optional(),
});

export type StrapiSkillsResponse = z.infer<typeof StrapiSkillsResponseSchema>;