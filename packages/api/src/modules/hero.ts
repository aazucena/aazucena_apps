import { z } from 'zod';
import { fetchStrapi } from '../services/strapi';
import { StrapiHeroSchema } from '../validators/hero';
import { transformHero, DEFAULT_HERO } from '../transformers/hero';
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
