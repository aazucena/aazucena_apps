import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { StrapiProjectsResponseSchema } from '../validators/projects';
import { transformProjects, DEFAULT_PROJECTS } from '../transformers/projects';
import type { Project } from '@aazucena/types';

/**
 * Fetch projects from Strapi CMS
 */
export async function getProjects(
  displayFilter: 'all' | 'listed' | 'featured' | 'home' = 'all',
): Promise<Project[]> {
  try {
    const filters: any = {};
    if (displayFilter === 'featured') filters.display = { $eq: 'featured' };
    if (displayFilter === 'home') filters.display = { $eq: 'home' };
    if (displayFilter === 'listed') filters.display = { $in: ['standard', 'featured', 'home'] };

    const response = await fetchStrapi('projects', {
      query: {
        filters,
        populate: [
          'coverImage.src',
          'screenshots.src',
          'gallery',
          'tags',
          'techStack.category',
          'metrics',
          'seo',
          'relatedLinks',
          'experience',
        ],
        sort: ['sort:asc'],
        pagination: { pageSize: 100 },
      },
      cache: 'force-cache',
    });

    const validated = StrapiProjectsResponseSchema.parse(response);
    return transformProjects(validated.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Projects API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Projects API] Failed to fetch projects:', error);
    }
    return DEFAULT_PROJECTS;
  }
}
