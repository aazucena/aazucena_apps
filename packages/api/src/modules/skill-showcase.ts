import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { StrapiSkillShowcaseSchema } from '../validators/skill-showcase';
import {
  transformSkillShowcase,
  DEFAULT_SKILL_SHOWCASE,
  type SkillShowcaseConfig,
} from '../transformers/skill-showcase';

/**
 * Fetch skill showcase configuration
 */
export async function getSkillShowcase(): Promise<SkillShowcaseConfig> {
  try {
    const response = await fetchStrapi('skill-showcase', {
      query: { populate: ['header'] },
    });

    const validated = StrapiSkillShowcaseSchema.parse(response.data);
    return transformSkillShowcase(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[SkillShowcase API] Invalid CMS data:', error.issues);
    } else {
      console.error('[SkillShowcase API] Failed to fetch skill showcase:', error);
    }
    return DEFAULT_SKILL_SHOWCASE;
  }
}
