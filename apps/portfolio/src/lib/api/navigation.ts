import { fetchStrapi } from "../strapi";
import { validateNavigationRender } from "../validators/navigation";
import {
  transformNavigationRender,
  getDefaultNavigation,
} from "../transformers/navigation";
import type { Navigation } from "../validators/navigation";

/**
 * Fetch navigation by slug from Strapi
 * @param slug - Navigation slug (e.g., 'main-navigation')
 * @returns Transformed navigation data with fallback
 */
export async function getNavigation(slug: string): Promise<Navigation> {
  try {
    // Note: type=TREE is passed as URL parameter for Strapi navigation plugin
    const data = await fetchStrapi(`navigation/render/${slug}?type=TREE`, {
      cache: "force-cache", // SSG caching
    });

    // Validate render response (array of items)
    const validatedItems = validateNavigationRender(data);

    // Transform to internal Navigation structure (flattens additionalFields)
    return transformNavigationRender(validatedItems, slug);
  } catch (error) {
    console.error(`Failed to fetch navigation "${slug}":`, error);
    // Return fallback navigation
    return getDefaultNavigation(slug);
  }
}

/**
 * Fetch all navigation containers in parallel
 */
export async function getAllNavigations() {
  const [mainNav, footerNav] = await Promise.all([
    getNavigation("main-navigation"),
    getNavigation("footer-navigation"),
  ]);

  return {
    mainNav,
    footerNav,
  };
}
