import { z } from 'zod';

/**
 * Zod validation schema for Strapi Skill Category content type
 * Categories for organizing skills (Frontend, Backend, DevOps, etc.)
 */
export const StrapiSkillCategorySchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  name: z.string().max(50).regex(/^[a-z0-9-]+$/), // kebab-case identifier
  label: z.string().max(100), // Display label (e.g., "Frontend Development")
  icon: z.string().nullable().optional(), // Icon from @mynaui/icons-react
  display: z.enum(['hidden', 'visible']).nullable().optional(), // Visibility control
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
    .optional(), // Color variant for category styling

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),

  // Relations (optional, only if populated)
  skills: z.array(z.any()).optional(), // OneToMany relation to skills
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
