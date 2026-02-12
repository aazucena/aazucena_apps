import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiEducationResponseSchema } from '../validators/education.js';
import { transformEducation, transformEducationList } from '../transformers/education.js';
import type { Education } from '@aazucena/types';

/**
 * Fetch all education entries
 */
export async function fetchEducation(): Promise<Education[]> {
  try {
    const response = await fetchStrapi('educations', {
      query: {
        populate: [
          'institutionLogo',
          'skills.category',
          'achievements',
          'relatedLinks',
          'projects',
        ],
        sort: ['sort:asc', 'startDate:desc'],
      },
    });

    const validated = StrapiEducationResponseSchema.parse(response);
    return transformEducationList(validated.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Education API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Education API] Failed to fetch education:', error);
    }
    return [];
  }
}

/**
 * Fetch single education entry by slug
 */
export async function getEducationBySlug(slug: string): Promise<Education | null> {
  try {
    const response = await fetchStrapi('educations', {
      query: {
        filters: { slug: { $eq: slug } },
        populate: [
          'institutionLogo',
          'skills.category',
          'achievements',
          'relatedLinks',
          'projects',
        ],
      },
    });

    const validated = StrapiEducationResponseSchema.parse(response);
    const entry = validated.data[0];
    if (!entry) return null;
    return transformEducation(entry);
  } catch (error) {
    console.error(`[Education API] Failed to fetch education slug ${slug}:`, error);
    return null;
  }
}
