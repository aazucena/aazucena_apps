import { getPreloaderConfig } from '../api/preloader';
import { getWebsiteConfig } from '../api/website-config';
import { getTheme } from '../api/theme';
import { getMaintenance } from '../api/maintenance';

export interface LayoutDataResponse {
  preloaderConfig: Awaited<ReturnType<typeof getPreloaderConfig>>;
  websiteConfig: Awaited<ReturnType<typeof getWebsiteConfig>>;
  themeConfig: Awaited<ReturnType<typeof getTheme>>;
  maintenance: Awaited<ReturnType<typeof getMaintenance>>;
}

/**
 * Fetches all layout configuration data from Strapi CMS in parallel
 * Used by BaseLayout.astro to configure site-wide settings
 * Falls back to defaults if CMS is unavailable (built into each API client)
 */
export async function getLayoutData(): Promise<LayoutDataResponse> {
  const [preloaderConfig, websiteConfig, themeConfig, maintenance] = await Promise.all([
    getPreloaderConfig(),
    getWebsiteConfig(),
    getTheme(),
    getMaintenance(),
  ]);

  // Log maintenance status in development
  if (import.meta.env.DEV && maintenance.enabled) {
    console.warn('[Maintenance] Site is in maintenance mode:', maintenance.message);
  }

  return {
    preloaderConfig,
    websiteConfig,
    themeConfig,
    maintenance,
  };
}
