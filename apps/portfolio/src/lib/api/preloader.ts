import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiPreloaderConfigSchema } from '~/lib/validators/preloader';
import { transformPreloaderConfig, DEFAULT_PRELOADER_CONFIG } from '~/lib/transformers/preloader';
import type { PreloaderPropsWithTheme } from '~/components/preloader/types';

/**
 * Fetches preloader configuration from Strapi CMS
 * Falls back to default config if CMS is unavailable or disabled
 * Validates CMS response with Zod for runtime type safety
 */
export async function getPreloaderConfig(): Promise<PreloaderPropsWithTheme> {
  try {
    const response = await fetchStrapi('preloader', {
      query: {
        populate: ['continueButton', 'loadingSteps'],
      },
    });

    // Validate response data with Zod
    const validatedData = StrapiPreloaderConfigSchema.parse(response.data);

    // If preloader is disabled in CMS, return defaults
    if (!validatedData.enabled) {
      console.warn('[Preloader] CMS config is disabled, using defaults');
      return DEFAULT_PRELOADER_CONFIG;
    }

    return transformPreloaderConfig(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Preloader] Invalid CMS data structure:', error.issues);
      console.error('[Preloader] Falling back to defaults');
    } else {
      console.error('[Preloader] Failed to fetch CMS config:', error);
    }

    return DEFAULT_PRELOADER_CONFIG;
  }
}