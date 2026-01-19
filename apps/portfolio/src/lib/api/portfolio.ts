import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiPortfolioSchema } from '~/lib/validators/portfolio';
import { transformPortfolio, DEFAULT_PORTFOLIO } from '~/lib/transformers/portfolio';
import type { ProfileData } from '~/components/animations/sections/data/about';

/**
 * Fetches portfolio/profile data from Strapi CMS
 */
export async function getPortfolio(): Promise<ProfileData> {
  try {
    const response = await fetchStrapi('portfolio', {
      query: {
        populate: {
          profileImage: true,
          resumeFile: true,
          socialLinks: true,
          education: true,
        },
      },
      cache: 'force-cache',
    });

    const validatedData = StrapiPortfolioSchema.parse(response.data);
    return transformPortfolio(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Portfolio] Invalid CMS data:', error.issues);
    } else {
      console.error('[Portfolio] Failed to fetch:', error);
    }
    return DEFAULT_PORTFOLIO;
  }
}
