import { fetchStrapi, updateStrapiEntry } from '../services/strapi';
import { StrapiPromptsResponseSchema } from '../validators/prompt';
import { transformPrompts, transformPrompt, type Prompt } from '../transformers/prompt';

/**
 * Fetches all AI prompts from Strapi
 */
export async function getPrompts(): Promise<Prompt[]> {
  try {
    const data = await fetchStrapi('prompts', {
      query: {
        populate: ['tags'],
        sort: ['name:asc'],
      },
    });

    const validated = StrapiPromptsResponseSchema.parse(data);
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

/**
 * Fetches a single AI prompt by its slug
 */
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const data = await fetchStrapi('prompts', {
      query: {
        filters: {
          slug: { $eq: slug },
        },
        populate: ['tags'],
      },
    });

    const validated = StrapiPromptsResponseSchema.parse(data);
    if (validated.data.length === 0) return null;

    const prompts = transformPrompts(validated.data);
    return prompts[0] || null;
  } catch (error) {
    console.error(`Error fetching prompt with slug ${slug}:`, error);
    return null;
  }
}
