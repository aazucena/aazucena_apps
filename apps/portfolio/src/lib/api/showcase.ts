import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiShowcaseSchema } from '~/lib/validators/showcase';
import {
  transformShowcase,
  DEFAULT_SHOWCASE_CONFIG,
} from '~/lib/transformers/showcase';
import type { ShowcaseConfig } from '~/lib/transformers/showcase';

/**
 * Fetches project showcase configuration from Strapi CMS
 */
export async function getShowcaseConfig(): Promise<ShowcaseConfig> {
  try {
    const response = await fetchStrapi('project-showcase', {
      cache: 'force-cache',
    });

    const validatedData = StrapiShowcaseSchema.parse(response.data);
    return transformShowcase(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Showcase] Invalid CMS data:', error.issues);
    } else {
      console.error('[Showcase] Failed to fetch:', error);
    }
    return DEFAULT_SHOWCASE_CONFIG;
  }
}
