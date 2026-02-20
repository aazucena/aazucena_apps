import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiHeroSchema } from "~/lib/validators/hero";
import { transformHero, DEFAULT_HERO } from "~/lib/transformers/hero";
import type { HeroData } from "~/lib/transformers/hero";

/**
 * Fetches hero section configuration from Strapi CMS
 */
export async function getHero(): Promise<HeroData> {
  try {
    const response = await fetchStrapi("hero", {
      cache: "force-cache",
    });

    const validatedData = StrapiHeroSchema.parse(response.data);
    return transformHero(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Hero] Invalid CMS data:", error.issues);
    } else {
      console.error("[Hero] Failed to fetch:", error);
    }
    return DEFAULT_HERO;
  }
}
