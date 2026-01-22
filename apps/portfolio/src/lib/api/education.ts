/**
 * API client for Education collection type
 * Fetches academic education history from Strapi CMS
 */

import { fetchStrapi } from '../strapi';
import { transformEducationList } from '../transformers/education';
import { StrapiEducationResponseSchema, type Education, type StrapiEducation } from '../validators/education';

/**
 * Fetch all published education entries
 * @returns Array of education entries sorted by sort field and date
 */
export async function fetchEducation(): Promise<StrapiEducation[]> {
  try {
    const response = await fetchStrapi<Education[]>('educations', {
      query: {
        populate: {
          achievements: true,
          institutionLogo: true,
          skills: {
            populate: ['category'],
          },
          relatedLinks: true,
        },
        sort: ['sort:desc', 'startDate:desc'],
        filters: {
          publishedAt: {
            $notNull: true,
          },
        },
      },
    });
    const validatedData = StrapiEducationResponseSchema.parse(response);

    return transformEducationList(validatedData.data);
  } catch (error) {
    console.error('Error fetching education:', error);
    return [];
  }
}

/**
 * Fetch featured education entries only
 * @returns Array of featured education entries
 */
export async function fetchFeaturedEducation(): Promise<StrapiEducation[]> {
  try {
    const response = await fetchStrapi<Education[]>('educations', {
      query: {
        populate: {
          achievements: true,
          institutionLogo: true,
          skills: {
            populate: ['category'],
          },
          relatedLinks: true,
        },
        filters: {
          featured: {
            $eq: true,
          },
          publishedAt: {
            $notNull: true,
          },
        },
        sort: ['sort:desc', 'startDate:desc'],
      },
    });

    
    const validatedData = StrapiEducationResponseSchema.parse(response);

    return transformEducationList(validatedData.data);
  } catch (error) {
    console.error('Error fetching featured education:', error);
    return [];
  }
}

/**
 * Fetch a single education entry by slug
 * @param slug - Education slug
 * @returns Single education entry or null
 */
export async function fetchEducationBySlug(slug: string): Promise<StrapiEducation | null> {
  try {
    const response = await fetchStrapi<Education[]>('educations', {
      query: {
        filters: {
          slug: {
            $eq: slug,
          },
          publishedAt: {
            $notNull: true,
          },
        },
        populate: {
          achievements: true,
          institutionLogo: true,
          skills: {
            populate: ['category'],
          },
          relatedLinks: true,
          projects: true,
        },
      },
    });

    const rawEducation = response.data?.[0];
    if (!rawEducation) {
      return null;
    }

    const validatedData = StrapiEducationResponseSchema.parse(response);


    return transformEducationList(validatedData.data)[0] || null;
  } catch (error) {
    console.error(`Error fetching education by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use fetchEducation() instead
 */
export async function getEducation(): Promise<StrapiEducation[]> {
  return fetchEducation();
}
