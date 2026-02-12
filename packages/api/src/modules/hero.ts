import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiHeroSchema } from '../validators/hero.js';
import { transformHero, DEFAULT_HERO } from '../transformers/hero.js';
import type { HeroData } from '@aazucena/types';

/**
 * Fetches hero section configuration from Strapi CMS
 */
export async function getHero(): Promise<HeroData> {
  try {
    const response = await fetchStrapi('hero', {
      cache: 'force-cache',
    });

    const validatedData = StrapiHeroSchema.parse(response.data);
    return transformHero(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Hero] Invalid CMS data:', error.issues);
    } else {
      console.error('[Hero] Failed to fetch:', error);
    }
    return DEFAULT_HERO;
  }
}
