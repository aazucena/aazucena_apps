import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiPostsResponseSchema } from '~/lib/validators/posts';
import { transformPosts, DEFAULT_POSTS } from '~/lib/transformers/posts';
import type { BlogPost } from '~/components/animations/sections/data/blog';

/**
 * Fetches posts from Strapi CMS
 * @param featuredOnly - Only return featured posts
 * @param pageSize - Number of posts to fetch (default: 6)
 */
export async function getPosts(
  featuredOnly: boolean = false,
  pageSize: number = 6
): Promise<BlogPost[]> {
  try {
    const filters: any = {};
    if (featuredOnly) {
      filters.featured = { $eq: true };
    }

    const response = await fetchStrapi('posts', {
      query: {
        populate: ['coverImage'],
        filters,
        sort: ['publishedAt:desc'],
        pagination: {
          pageSize,
        },
        publicationState: 'live',
      },
    });

    const validatedData = StrapiPostsResponseSchema.parse(response);
    return transformPosts(validatedData.data, featuredOnly);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Posts] Invalid CMS data:', error.issues);
    } else {
      console.error('[Posts] Failed to fetch:', error);
    }
    return DEFAULT_POSTS;
  }
}
