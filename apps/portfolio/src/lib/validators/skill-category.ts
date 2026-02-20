import { z } from "zod";
import { SkillCategoryVariantEnum, CategoryDisplayEnum } from "./enums";

/**
 * Zod validation schema for Strapi Skill Category content type
 * Categories for organizing skills (Frontend, Backend, DevOps, etc.)
 */
export const StrapiSkillCategorySchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string().regex(/^[a-z0-9-]+$/), // kebab-case
  label: z.string(),
  icon: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
  display: CategoryDisplayEnum.default("visible"),
  variant: SkillCategoryVariantEnum.nullable().optional(),
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
