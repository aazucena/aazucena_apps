import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { StrapiAboutSchema } from '../validators/about';
import { transformAbout, DEFAULT_ABOUT } from '../transformers/about';
import type { AboutData } from '@aazucena/types';

/**
 * Fetch about section configuration
 */
export async function getAbout(): Promise<AboutData> {
  try {
    const response = await fetchStrapi('about', {
      query: {
        populate: [
          'stats',
          'learnMoreCards.button',
          'focusAreas',
          'roots',
          'interests',
          'coreValues',
          'workflow',
          'languages',
        ],
      },
    });

    const validated = StrapiAboutSchema.parse(response.data);
    return transformAbout(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[About API] Invalid CMS data:', error.issues);
    } else {
      console.error('[About API] Failed to fetch about:', error);
    }
    return DEFAULT_ABOUT;
  }
}
