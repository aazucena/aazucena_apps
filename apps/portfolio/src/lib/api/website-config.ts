import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiWebsiteConfigSchema } from '~/lib/validators/website-config';
import { transformWebsiteConfig, DEFAULT_WEBSITE_CONFIG } from '~/lib/transformers/website-config';
import type { WebsiteConfigData } from '~/lib/transformers/website-config';

/**
 * Fetches website configuration from Strapi CMS
 */
export async function getWebsiteConfig(): Promise<WebsiteConfigData> {
  try {
    const response = await fetchStrapi('website-configuration', {
      query: {
        populate: {
          siteLogo: true,
          favicon: true,
          defaultSEO: {
            populate: {
              metaImage: true,
              openGraph: {
                populate: {
                  ogImage: true,
                },
              },
            },
          },
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiWebsiteConfigSchema.parse(response.data);
    return transformWebsiteConfig(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[WebsiteConfig] Invalid CMS data:', error.issues);
    } else {
      console.error('[WebsiteConfig] Failed to fetch:', error);
    }
    return DEFAULT_WEBSITE_CONFIG;
  }
}
