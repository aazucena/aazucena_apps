import { getPreloaderConfig } from "@aazucena/api";
import { getMaintenance } from "@aazucena/api";
import { getWebsiteConfig } from "@aazucena/api";
import { SITE_CONFIG } from "~/config/site";

export interface LayoutDataResponse {
  siteConfig: typeof SITE_CONFIG;
  websiteConfig: Awaited<ReturnType<typeof getWebsiteConfig>>;
  preloaderConfig: Awaited<ReturnType<typeof getPreloaderConfig>>;
  maintenance: Awaited<ReturnType<typeof getMaintenance>>;
}

/**
 * Returns static site configuration (no API call)
 */
export function getSiteConfig() {
  return SITE_CONFIG;
}

/**
 * Fetches dynamic layout configuration data from Strapi CMS in parallel
 * Used by BaseLayout.astro to configure site-wide settings
 */
export async function getLayoutData(): Promise<LayoutDataResponse> {
  const [websiteConfig, preloaderConfig, maintenance] = await Promise.all([
    getWebsiteConfig(),
    getPreloaderConfig(),
    getMaintenance(),
  ]);

  // Log maintenance status in development
  if (import.meta.env.DEV && maintenance.enabled) {
    console.warn(
      "[Maintenance] Site is in maintenance mode:",
      maintenance.message,
    );
  }

  return {
    siteConfig: SITE_CONFIG,
    websiteConfig,
    preloaderConfig,
    maintenance,
  };
}
