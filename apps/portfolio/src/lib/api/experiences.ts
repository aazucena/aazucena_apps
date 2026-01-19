import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiExperiencesResponseSchema } from '~/lib/validators/experiences';
import { transformExperiences, DEFAULT_EXPERIENCES } from '~/lib/transformers/experiences';
import type { Experience } from '~/components/animations/sections/data/experiences';

/**
 * Fetches experiences from Strapi CMS
 */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const response = await fetchStrapi('experiences', {
      query: {
        populate: ['achievements', 'companyLogo', 'skillsUsed'],
        sort: ['startDate:desc'],
        pagination: {
          pageSize: 100,
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiExperiencesResponseSchema.parse(response);
    return transformExperiences(validatedData.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Experiences] Invalid CMS data:', error.issues);
    } else {
      console.error('[Experiences] Failed to fetch:', error);
    }
    return DEFAULT_EXPERIENCES;
  }
}
