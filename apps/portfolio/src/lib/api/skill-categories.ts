import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiSkillCategoriesResponseSchema } from "~/lib/validators/skill-category";
import {
  transformSkillCategories,
  DEFAULT_SKILL_CATEGORIES,
} from "~/lib/transformers/skill-category";
import type { SkillCategoryInfo } from "~/lib/transformers/skill-category";

/**
 * Fetches skill categories from Strapi CMS
 * Falls back to default categories if CMS is unavailable
 * Validates CMS response with Zod for runtime type safety
 *
 * @returns Array of skill categories sorted alphabetically
 */
export async function getSkillCategories(): Promise<SkillCategoryInfo[]> {
  try {
    const response = await fetchStrapi("skill-categories", {
      query: {
        sort: ["name:asc"],
        pagination: {
          pageSize: 100, // Get all categories
        },
      },
      cache: "force-cache", // Cache for build-time SSG
    });

    // Validate response data with Zod
    const validatedData = StrapiSkillCategoriesResponseSchema.parse(response);

    // Transform to frontend format
    return transformSkillCategories(validatedData.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "[Skill Categories] Invalid CMS data structure:",
        error.issues,
      );
      console.error("[Skill Categories] Falling back to defaults");
    } else {
      console.error(
        "[Skill Categories] Failed to fetch CMS categories:",
        error,
      );
    }

    return DEFAULT_SKILL_CATEGORIES;
  }
}

/**
 * Fetches a single skill category by name
 * @param name - kebab-case category name (e.g., "frontend")
 * @returns Skill category or undefined if not found
 */
export async function getSkillCategoryByName(
  name: string,
): Promise<SkillCategoryInfo | undefined> {
  const categories = await getSkillCategories();
  return categories.find((cat) => cat.name === name);
}
