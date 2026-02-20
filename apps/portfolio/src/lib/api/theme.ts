import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiThemeSchema } from "~/lib/validators/theme";
import { transformTheme, DEFAULT_THEME } from "~/lib/transformers/theme";
import type { ThemeData } from "~/lib/transformers/theme";

/**
 * Fetches theme & branding configuration from Strapi CMS
 */
export async function getTheme(): Promise<ThemeData> {
  try {
    const response = await fetchStrapi("theme", {
      cache: "force-cache",
    });

    const validatedData = StrapiThemeSchema.parse(response.data);
    return transformTheme(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Theme] Invalid CMS data:", error.issues);
    } else {
      console.error("[Theme] Failed to fetch:", error);
    }
    return DEFAULT_THEME;
  }
}
