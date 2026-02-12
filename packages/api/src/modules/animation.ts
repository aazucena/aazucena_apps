import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiAnimationSchema } from '../validators/animation.js';
import { transformAnimation, DEFAULT_ANIMATION_CONFIG } from '../transformers/animation.js';
import type { AnimationConfigData } from '@aazucena/types';

/**
 * Fetches animation system configuration from Strapi CMS
 */
export async function getAnimationConfig(): Promise<AnimationConfigData> {
  try {
    const response = await fetchStrapi('animation', {
      cache: 'force-cache',
    });

    const validatedData = StrapiAnimationSchema.parse(response.data);
    return transformAnimation(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[AnimationConfig] Invalid CMS data:', error.issues);
    } else {
      console.error('[AnimationConfig] Failed to fetch:', error);
    }
    return DEFAULT_ANIMATION_CONFIG;
  }
}
