import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiSkillsResponseSchema } from "../validators/skills";
import { groupSkillsByCategory } from "../transformers/skills";

/**
 * Fetch skills from Strapi CMS
 */
export async function getSkills(
  displayFilter: "all" | "core" | "featured" = "all",
) {
  try {
    const filters: any = {};
    if (displayFilter === "core") filters.display = { $eq: "core" };
    if (displayFilter === "featured")
      filters.display = { $in: ["core", "featured"] };

    const response = await fetchStrapi("skills", {
      query: {
        filters,
        populate: ["category"],
        sort: ["sort:asc", "name:asc"],
        pagination: { pageSize: 200 },
      },
    });

    const validated = StrapiSkillsResponseSchema.parse(response);
    return groupSkillsByCategory(validated.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Skills API] Invalid CMS data:", error.issues);
    } else {
      console.error("[Skills API] Failed to fetch skills:", error);
    }
    return [];
  }
}
