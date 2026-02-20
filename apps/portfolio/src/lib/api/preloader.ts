import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiPreloaderConfigSchema } from "../validators/preloader";
import {
  transformPreloader,
  DEFAULT_PRELOADER,
  type PreloaderConfig,
} from "../transformers/preloader";

/**
 * Fetch preloader configuration
 */
export async function getPreloaderConfig(): Promise<PreloaderConfig> {
  try {
    const response = await fetchStrapi("preloader", {
      query: { populate: ["continueButton", "loadingSteps"] },
    });

    const validated = StrapiPreloaderConfigSchema.parse(response.data);
    return transformPreloader(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Preloader API] Invalid CMS data:", error.issues);
    } else {
      console.error("[Preloader API] Failed to fetch preloader:", error);
    }
    return DEFAULT_PRELOADER;
  }
}
