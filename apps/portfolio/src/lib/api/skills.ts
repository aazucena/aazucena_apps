import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiSkillsResponseSchema } from '~/lib/validators/skills';
import {
  transformSkills,
  transformTechStackBadges,
  DEFAULT_SKILLS,
  DEFAULT_TECH_STACK_BADGES,
} from '~/lib/transformers/skills';
import type { SkillCategory } from '~/components/animations/sections/data/skills';

/**
 * Fetches skills from Strapi CMS and transforms them into grouped categories
 * Falls back to default skills if CMS is unavailable
 * Validates CMS response with Zod for runtime type safety
 *
 * @param displayFilter - Filter by display type ('all', 'standard', 'featured', 'core')
 * @returns Array of skill categories grouped by category
 */
export async function getSkills(
  displayFilter: 'all' | 'standard' | 'featured' | 'core' = 'all'
): Promise<SkillCategory[]> {
  try {
    const response = await fetchStrapi('skills', {
      query: {
        populate: ['category'], // ADDED: populate category relation
        sort: ['sort:asc', 'name:asc'],
        pagination: {
          pageSize: 100, // Get all skills
        },
      },
      cache: 'force-cache', // Cache for build-time SSG
    });

    // Validate response data with Zod
    const validatedData = StrapiSkillsResponseSchema.parse(response);

    // Transform to frontend format
    return transformSkills(validatedData.data, displayFilter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Skills] Invalid CMS data structure:', error.issues);
      console.error('[Skills] Falling back to defaults');
    } else {
      console.error('[Skills] Failed to fetch CMS skills:', error);
    }

    return DEFAULT_SKILLS;
  }
}

/**
 * Fetches featured/core skills for tech stack badges
 * Falls back to default badges if CMS is unavailable
 *
 * @param maxCount - Maximum number of badges to return (default: 6)
 * @returns Array of skill names for tech stack badges
 */
export async function getTechStackBadges(maxCount: number = 6): Promise<string[]> {
  try {
    const response = await fetchStrapi('skills', {
      query: {
        populate: ['category'], // ADDED: populate category relation
        filters: {
          $or: [
            { display: { $eq: 'featured' } },
            { display: { $eq: 'core' } },
          ],
        },
        sort: ['sort:asc'],
        pagination: {
          pageSize: maxCount,
        },
      },
      cache: 'force-cache',
    });

    // Validate response data with Zod
    const validatedData = StrapiSkillsResponseSchema.parse(response);

    // Transform to badge array
    return transformTechStackBadges(validatedData.data, maxCount);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Tech Stack Badges] Invalid CMS data structure:', error.issues);
      console.error('[Tech Stack Badges] Falling back to defaults');
    } else {
      console.error('[Tech Stack Badges] Failed to fetch CMS badges:', error);
    }

    return DEFAULT_TECH_STACK_BADGES;
  }
}
