import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiExperienceShowcaseSchema } from '../validators/experience-showcase.js';
import {
  transformExperienceShowcase,
  DEFAULT_EXPERIENCE_SHOWCASE,
} from '../transformers/experience-showcase.js';
import type { ExperienceShowcaseConfig } from '@aazucena/types';

/**
 * Fetch experience showcase configuration
 */
export async function getExperienceShowcase(): Promise<ExperienceShowcaseConfig> {
  try {
    const response = await fetchStrapi('experience-showcase', {
      query: { populate: ['header'] },
    });

    const validated = StrapiExperienceShowcaseSchema.parse(response.data);
    return transformExperienceShowcase(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[ExperienceShowcase API] Invalid CMS data:', error.issues);
    } else {
      console.error('[ExperienceShowcase API] Failed to fetch experience showcase:', error);
    }
    return DEFAULT_EXPERIENCE_SHOWCASE;
  }
}
