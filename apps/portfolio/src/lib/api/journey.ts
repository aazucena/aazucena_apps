import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiJourneySchema } from '../validators/journey';
import { 
  transformJourney, 
  DEFAULT_JOURNEY, 
  type JourneyPageConfig 
} from '../transformers/journey-page';

/**
 * Fetch journey page configuration and narrative
 */
export async function getJourneyPage(): Promise<JourneyPageConfig> {
  try {
    const response = await fetchStrapi('journey', {
      query: { populate: ['header', 'phases.items', 'callToAction.buttons'] },
    });

    const validated = StrapiJourneySchema.parse(response.data);
    return transformJourney(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Journey API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Journey API] Failed to fetch journey page:', error);
    }
    return DEFAULT_JOURNEY;
  }
}
