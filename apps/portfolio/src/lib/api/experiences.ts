import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiExperiencesResponseSchema, type StrapiExperience } from '~/lib/validators/experiences';
import { transformExperiences, transformExperience, DEFAULT_EXPERIENCES } from '~/lib/transformers/experiences';
import type { Experience } from '~/components/animations/sections/data/experiences';

/**
 * Fetches all experiences from Strapi CMS
 */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const response = await fetchStrapi('experiences', {
      query: {
        populate: {
          achievements: true,
          companyLogo: true,
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

/**
 * Fetches a single experience by slug
 * @param slug - Experience slug
 */
export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  try {
    const response = await fetchStrapi<Experience[]>('experiences', {
      query: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          achievements: true,
          companyLogo: true,
          skillsUsed: {
            populate: ['category'],
          },
          relatedLinks: true,
          projects: true,
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiExperiencesResponseSchema.parse(response);

    if (validatedData.data.length === 0) {
      console.warn(`[Experiences] No experience found with slug: ${slug}`);
      return null;
    }

    // Transform single experience (pass index 0 for gradient generation)
    return transformExperience(validatedData.data[0] as StrapiExperience, 0);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Experiences] Invalid CMS data for slug:', slug, error.issues);
    } else {
      console.error('[Experiences] Failed to fetch experience:', slug, error);
    }
    return null;
  }
}
