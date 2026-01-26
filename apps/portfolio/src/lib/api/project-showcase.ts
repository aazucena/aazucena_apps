import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiShowcaseSchema } from '../validators/project-showcase';
import {
  transformProjectShowcase,
  DEFAULT_PROJECT_SHOWCASE_CONFIG,
  type ProjectShowcaseConfig
} from '../transformers/project-showcase';

/**
 * Fetches project showcase configuration from Strapi CMS
 */
export async function getProjectShowcaseConfig(): Promise<ProjectShowcaseConfig> {
  try {
    const response = await fetchStrapi('project-showcase', {
      query: { populate: ['header'] },
      cache: 'force-cache',
    });

    const validatedData = StrapiShowcaseSchema.parse(response.data);
    return transformProjectShowcase(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[ProjectShowcase API] Invalid CMS data:', error.issues);
    } else {
      console.error('[ProjectShowcase API] Failed to fetch:', error);
    }
    return DEFAULT_PROJECT_SHOWCASE_CONFIG;
  }
}
