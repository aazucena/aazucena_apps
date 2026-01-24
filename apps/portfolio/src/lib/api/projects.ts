import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiProjectsResponseSchema } from '../validators/projects';
import { 
  transformProjects, 
  DEFAULT_PROJECTS, 
  type Project 
} from '../transformers/projects';

/**
 * Fetch projects from Strapi CMS
 */
export async function getProjects(displayFilter: 'all' | 'listed' | 'featured' | 'home' = 'all'): Promise<Project[]> {
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
          'tags', 
          'techStack.category', 
          'metrics', 
          'seo', 
          'relatedLinks', 
          'experience'
        ],
        sort: ['sort:asc'],
        pagination: { pageSize: 100 },
      },
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