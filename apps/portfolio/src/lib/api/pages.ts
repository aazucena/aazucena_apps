import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { PageSchema } from '../validators/page';
import { transformPage, DEFAULT_PAGE, type Page } from '../transformers/page';

/**
 * Fetch all published pages
 */
export async function getPages(): Promise<Page[]> {
  try {
    const response = await fetchStrapi('pages', {
      query: {
        populate: ['seo', 'seo.openGraph'],
        filters: {
          publishedAt: {
            $notNull: true,
          },
        },
        publicationState: 'live',
      },
    });

    // Validate and transform
    const pages = Array.isArray(response.data) ? response.data : [];
    const validated = pages.map((item: unknown) => PageSchema.parse(item));
    return validated.map(transformPage);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Pages API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Pages API] Failed to fetch pages:', error);
    }
    return [];
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await fetchStrapi('pages', {
      query: {
        populate: ['seo', 'seo.openGraph'],
        filters: {
          slug: {
            $eq: slug,
          },
          publishedAt: {
            $notNull: true,
          },
        },
        publicationState: 'live',
      },
    });

    const pages = Array.isArray(response.data) ? response.data : [];

    if (pages.length === 0) {
      console.warn(`[Pages API] No page found with slug: ${slug}`);
      return null;
    }

    const validated = PageSchema.parse(pages[0]);
    return transformPage(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[Pages API] Invalid CMS data for slug ${slug}:`, error.issues);
    } else {
      console.error(`[Pages API] Failed to fetch page ${slug}:`, error);
    }
    return null;
  }
}
