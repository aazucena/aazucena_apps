import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiProjectsResponseSchema } from '~/lib/validators/projects';
import { transformProjects, DEFAULT_PROJECTS } from '~/lib/transformers/projects';
import type { Project } from '~/components/animations/sections/data/projects';

/**
 * Fetches projects from Strapi CMS
 * @param displayFilter - Filter by display type
 */
export async function getProjects(
  displayFilter: 'all' | 'standard' | 'featured' | 'home' = 'all'
): Promise<Project[]> {
  try {
    const response = await fetchStrapi('projects', {
      query: {
        sort: ['sort:asc', 'publishedAt:desc'],
        pagination: {
          pageSize: 100,
        },
        publicationState: 'live',
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiProjectsResponseSchema.parse(response);
    return transformProjects(validatedData.data, displayFilter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Projects] Invalid CMS data:', error.issues);
    } else {
      console.error('[Projects] Failed to fetch:', error);
    }
    return DEFAULT_PROJECTS;
  }
}
