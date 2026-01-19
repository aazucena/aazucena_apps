import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiAboutSchema } from '~/lib/validators/about';
import { transformAbout, DEFAULT_ABOUT } from '~/lib/transformers/about';
import type { AboutData } from '~/lib/transformers/about';

/**
 * Fetches about section configuration from Strapi CMS
 */
export async function getAbout(): Promise<AboutData> {
  try {
    const response = await fetchStrapi('about', {
      query: {
        populate: {
          stats: true,
          learnMoreCards: {
            populate: {
              button: true,
            },
          },
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiAboutSchema.parse(response.data);
    return transformAbout(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[About] Invalid CMS data:', error.issues);
    } else {
      console.error('[About] Failed to fetch:', error);
    }
    return DEFAULT_ABOUT;
  }
}
