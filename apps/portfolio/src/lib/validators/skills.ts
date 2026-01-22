import { z } from 'zod';
import { StrapiSkillCategorySchema } from './skill-category';
/**
 * Zod validation schema for Strapi Skill content type
 * Ensures runtime type safety for CMS data
 */
export const StrapiSkillSchema = z.object({
  id: z.number().nullable().optional(),
  documentId: z.string().nullable().optional(),
  name: z.string().max(100),
  display: z.enum(['hidden', 'standard', 'featured', 'core'] as const),

  // CHANGED: category is now a relation to skill-category, not hardcoded enum
  // Strapi v5 wraps relations in a 'data' property
  category: StrapiSkillCategorySchema,

  proficiency: z.enum(['learning', 'competent', 'proficient', 'expert']),
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
  // Relations (optional, only if populated)
  experiences: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(), // ManyToMany relation to Education (Phase 0.5)
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

export type StrapiSkill = z.infer<typeof StrapiSkillSchema>;
export type StrapiSkillsResponse = z.infer<typeof StrapiSkillsResponseSchema>;
