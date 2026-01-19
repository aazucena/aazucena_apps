import { z } from 'zod';

/**
 * Zod validation schema for Strapi Skill content type
 * Ensures runtime type safety for CMS data
 */
export const StrapiSkillSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  name: z.string().max(100),
  display: z.enum(['hidden', 'standard', 'featured', 'core']),

  // CHANGED: category is now a relation to skill-category, not hardcoded enum
  category: z
    .object({
      id: z.number(),
      name: z.string(), // kebab-case (e.g., "frontend")
      label: z.string(), // Display label (e.g., "Frontend Development")
      display: z.enum(['hidden', 'visible']).nullable().optional(),
      icon: z.string().nullable().optional(),
      variant: z
        .enum([
          'cyan-blue',
          'purple-pink',
          'green-emerald',
          'blue-indigo',
          'yellow-orange',
          'pink-red',
          'teal-cyan',
          'orange-red',
          'violet-purple',
          'indigo-violet',
        ])
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),

  proficiency: z.enum(['learning', 'competent', 'proficient', 'expert']),
  icon: z.string().nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  yearsOfExperience: z.number().min(0).max(50).nullable().optional(),
  documentationUrl: z.string().max(2048).url().nullable().optional(),
  sort: z.number().nullable().optional(),
  lastUsed: z.string().nullable().optional(), // ISO date string

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),

  // Relations (optional, only if populated)
  experiences: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
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
