import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiAwardsResponseSchema } from '~/lib/validators/awards';
import { transformAwards, DEFAULT_AWARDS } from '~/lib/transformers/awards';
import type { Award } from '~/components/animations/sections/data/awards';

/**
 * Fetches awards from Strapi CMS
 */
export async function getAwards(): Promise<Award[]> {
  try {
    const response = await fetchStrapi('awards', {
      query: {
        populate: ['badge'],
        sort: ['year:desc', 'title:asc'],
        pagination: {
          pageSize: 100,
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiAwardsResponseSchema.parse(response);
    return transformAwards(validatedData.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Awards] Invalid CMS data:', error.issues);
    } else {
      console.error('[Awards] Failed to fetch:', error);
    }
    return DEFAULT_AWARDS;
  }
}
