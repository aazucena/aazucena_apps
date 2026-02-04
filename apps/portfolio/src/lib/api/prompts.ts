import { fetchStrapi } from '../strapi';
import { StrapiPromptsResponseSchema } from '../validators/prompt';
import { transformPrompts, type Prompt } from '../transformers/prompt';

/**
 * Fetches all AI prompts from Strapi
 */
export async function getPrompts(): Promise<Prompt[]> {
  try {
    const data = await fetchStrapi('prompts', {
      query: {
        populate: ['tags'],
      },
    });

    const validated = StrapiPromptsResponseSchema.parse(data);
    return transformPrompts(validated.data);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
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
