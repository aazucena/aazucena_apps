import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiHomepageSchema } from '~/lib/validators/homepage';
import { transformHomepage, DEFAULT_HOMEPAGE } from '~/lib/transformers/homepage';
import type { HomepageData } from '~/lib/transformers/homepage';

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
