// apps/analytics/src/lib/api/prompts.ts
import { fetchStrapi, updateStrapiEntry } from '../strapi';
import { StrapiPromptsResponseSchema } from '../validators/prompt';
import { transformPrompts, transformPrompt, type Prompt } from '../transformers/prompt';

/**
 * Fetches all AI prompts from Strapi using the mirrored API client
 */
export async function getPrompts(): Promise<Prompt[]> {
  try {
    const response = await fetchStrapi('prompts', {
      query: {
        populate: ['tags'],
        sort: ['name:asc'],
      },
    });

    const validated = StrapiPromptsResponseSchema.parse(response);
    return transformPrompts(validated.data);
  } catch (error) {
    console.error('[Prompts API] Failed to fetch prompts:', error);
    return [];
  }
}

/**
 * Updates an AI prompt in Strapi
 */
export async function updatePrompt(id: string, data: any): Promise<Prompt | null> {
  try {
    const response = await updateStrapiEntry<any>('prompts', id, data);
    return transformPrompt(response.data);
  } catch (error) {
    console.error(`[Prompts API] Failed to update prompt ${id}:`, error);
    return null;
  }
}
