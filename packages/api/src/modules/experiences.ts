import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiExperiencesResponseSchema } from '../validators/experiences.js';
import { transformExperiences, DEFAULT_EXPERIENCES } from '../transformers/experiences.js';
import type { Experience } from '@aazucena/types';

/**
 * Fetches all experiences from Strapi CMS
 */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const response = await fetchStrapi('experiences', {
      query: {
        populate: {
          achievements: true,
          companyLogo: { populate: ['src'] },
          skillsUsed: {
            populate: ['category'],
          },
          relatedLinks: true,
          projects: true,
        },
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
