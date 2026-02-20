import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiBlogConfigSchema } from "~/lib/validators/blog-config";
import {
  transformBlogConfig,
  DEFAULT_BLOG_CONFIG,
} from "~/lib/transformers/blog-config";
import type { BlogConfigData } from "~/lib/transformers/blog-config";

/**
 * Fetches blog configuration from Strapi CMS
 */
export async function getBlogConfig(): Promise<BlogConfigData> {
  try {
    const response = await fetchStrapi("blog", {
      cache: "force-cache",
    });

    const validatedData = StrapiBlogConfigSchema.parse(response.data);
    return transformBlogConfig(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[BlogConfig] Invalid CMS data:", error.issues);
    } else {
      console.error("[BlogConfig] Failed to fetch:", error);
    }
    return DEFAULT_BLOG_CONFIG;
  }
}
