import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiAwardsResponseSchema } from "../validators/awards";
import {
  transformAwards,
  DEFAULT_AWARDS,
  type Award,
} from "../transformers/awards";

/**
 * Fetch awards and certifications
 */
export async function getAwards(): Promise<Award[]> {
  try {
    const response = await fetchStrapi("awards", {
      query: {
        populate: ["badge", "certificate"],
        sort: ["year:desc", "createdAt:desc"],
      },
    });

    const validated = StrapiAwardsResponseSchema.parse(response);
    return transformAwards(validated.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Awards API] Invalid CMS data:", error.issues);
    } else {
      console.error("[Awards API] Failed to fetch awards:", error);
    }
    return DEFAULT_AWARDS;
  }
}
