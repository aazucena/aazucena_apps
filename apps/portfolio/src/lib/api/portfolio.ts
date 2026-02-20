import { z } from "zod";
import { fetchStrapi } from "../strapi";
import { StrapiPortfolioSchema } from "../validators/portfolio";
import {
  transformPortfolio,
  DEFAULT_PORTFOLIO,
  type PortfolioData,
} from "../transformers/portfolio";

/**
 * Fetch portfolio single type data
 */
export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const response = await fetchStrapi("portfolio", {
      query: {
        populate: ["profileImage.src", "resumeFile", "socialLinks"],
      },
    });

    const validated = StrapiPortfolioSchema.parse(response.data);
    return transformPortfolio(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Portfolio API] Invalid CMS data:", error.issues);
    } else {
      console.error("[Portfolio API] Failed to fetch portfolio:", error);
    }
    return DEFAULT_PORTFOLIO;
  }
}
