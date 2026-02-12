import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiWebsiteConfigSchema } from '../validators/website-config.js';
import { transformWebsiteConfig, DEFAULT_WEBSITE_CONFIG } from '../transformers/website-config.js';
import type { WebsiteConfig } from '@aazucena/types';

/**
 * Fetch general website configuration
 */
export async function getWebsiteConfig(): Promise<WebsiteConfig> {
  try {
    const response = await fetchStrapi('website-configuration', {
      query: {
        populate: ['defaultSEO.openGraph.ogImage', 'siteLogo', 'favicon', 'techStack'],
      },
    });

    const validated = StrapiWebsiteConfigSchema.parse(response.data);
    return transformWebsiteConfig(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[WebsiteConfig API] Invalid CMS data:', error.issues);
    } else {
      console.error('[WebsiteConfig API] Failed to fetch website config:', error);
    }
    return DEFAULT_WEBSITE_CONFIG;
  }
}
