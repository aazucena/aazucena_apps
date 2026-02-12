import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiHomepageSchema } from '../validators/homepage.js';
import { transformHomepage, DEFAULT_HOMEPAGE } from '../transformers/homepage.js';
import type { HomepageData } from '@aazucena/types';

/**
 * Fetches homepage configuration from Strapi CMS
 */
export async function getHomepage(): Promise<HomepageData> {
  try {
    const response = await fetchStrapi('homepage', {
      query: {
        populate: {
          sections: true,
          seo: { populate: ['openGraph'] }, // ADDED: populate seo component with nested openGraph
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiHomepageSchema.parse(response.data);
    return transformHomepage(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Homepage] Invalid CMS data:', error.issues);
    } else {
      console.error('[Homepage] Failed to fetch:', error);
    }
    return DEFAULT_HOMEPAGE;
  }
}
