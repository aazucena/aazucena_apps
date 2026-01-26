import { getPreloaderConfig } from '../api/preloader';
import { getMaintenance } from '../api/maintenance';
import { SITE_CONFIG } from '~/config/site';

export interface LayoutDataResponse {
  siteConfig: typeof SITE_CONFIG;
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
  const [preloaderConfig, maintenance] = await Promise.all([
    getPreloaderConfig(),
    getMaintenance(),
  ]);

  // Log maintenance status in development
  if (import.meta.env.DEV && maintenance.enabled) {
    console.warn('[Maintenance] Site is in maintenance mode:', maintenance.message);
  }

  return {
    siteConfig: SITE_CONFIG,
    preloaderConfig,
    maintenance,
  };
}