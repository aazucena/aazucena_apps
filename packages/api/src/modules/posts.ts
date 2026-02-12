import { z } from 'zod';
import { fetchStrapi } from '../services/strapi.js';
import { StrapiPostsResponseSchema } from '../validators/posts.js';
import { transformPosts, DEFAULT_POSTS } from '../transformers/posts.js';
import type { BlogPost } from '@aazucena/types';

/**
 * Fetch blog posts with filtering and pagination
 */
export async function getPosts(featuredOnly = false, limit = 100): Promise<BlogPost[]> {
  try {
    const response = await fetchStrapi('posts', {
      query: {
        filters: featuredOnly ? { featured: { $eq: true } } : {},
        populate: ['coverImage.src', 'tags', 'seo', 'relatedLinks'],
        sort: ['sort:asc', 'publishedAt:desc'],
        pagination: { pageSize: limit },
      },
    });

    const validated = StrapiPostsResponseSchema.parse(response);
    return transformPosts(validated.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Posts API] Invalid CMS data:', error.issues);
    } else {
      console.error('[Posts API] Failed to fetch posts:', error);
    }
    return DEFAULT_POSTS;
  }
}
