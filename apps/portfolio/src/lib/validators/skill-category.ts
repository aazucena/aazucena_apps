import { z } from 'zod';

/**
 * Zod validation schema for Strapi Skill Category content type
 * Categories for organizing skills (Frontend, Backend, DevOps, etc.)
 */
export const StrapiSkillCategorySchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string().regex(/^[a-z0-9-]+$/), // kebab-case (e.g., "frontend")
  label: z.string(), // Display label (e.g., "Frontend Development")
  icon: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  display: z.enum(['hidden', 'visible']).default('visible'),
  variant: z
    .enum([
        "cyan-blue",
        "purple-pink",
        "green-emerald",
        "blue-indigo",
        "yellow-orange",
        "pink-red",
        "teal-cyan",
        "orange-red",
        "violet-purple",
        "indigo-violet"
    ])
    .nullable()
    .optional(),
});

/**
 * Zod schema for Strapi collection response with Skill Categories array
 */
export const StrapiSkillCategoriesResponseSchema = z.object({
  data: z.array(StrapiSkillCategorySchema),
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

export type StrapiSkillCategory = z.infer<typeof StrapiSkillCategorySchema>;
export type StrapiSkillCategoriesResponse = z.infer<
  typeof StrapiSkillCategoriesResponseSchema
>;
