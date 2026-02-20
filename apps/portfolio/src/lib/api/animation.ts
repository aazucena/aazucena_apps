import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiAnimationSchema } from "~/lib/validators/animation";
import {
  transformAnimation,
  DEFAULT_ANIMATION_CONFIG,
} from "~/lib/transformers/animation";
import type { AnimationConfigData } from "~/lib/transformers/animation";

/**
 * Fetches animation system configuration from Strapi CMS
 */
export async function getAnimationConfig(): Promise<AnimationConfigData> {
  try {
    const response = await fetchStrapi("animation", {
      cache: "force-cache",
    });

    const validatedData = StrapiAnimationSchema.parse(response.data);
    return transformAnimation(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[AnimationConfig] Invalid CMS data:", error.issues);
    } else {
      console.error("[AnimationConfig] Failed to fetch:", error);
    }
    return DEFAULT_ANIMATION_CONFIG;
  }
}
