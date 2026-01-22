import { z } from 'zod';
import { fetchStrapi } from '../strapi';
import { StrapiPostSchema, StrapiPostsResponseSchema } from '~/lib/validators/posts';
import { transformPosts, transformPostDetail, DEFAULT_POSTS } from '~/lib/transformers/posts';
import type { BlogPost } from '~/components/animations/sections/data/blog';
import type { BlogPostDetail } from '~/lib/transformers/posts';

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

/**
 * Fetches a single post by slug from Strapi CMS
 * Returns full post detail with richtext content
 * @param slug - Post slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const response = await fetchStrapi('posts', {
      query: {
        populate: ['coverImage', 'tags', 'seo', 'seo.openGraph', 'relatedLinks'],
        filters: {
          slug: { $eq: slug },
        },
        publicationState: 'live',
      },
    });

    const validatedData = StrapiPostsResponseSchema.parse(response);

    if (validatedData.data.length === 0) {
      return null;
    }

    return transformPostDetail(validatedData.data[0]!);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Posts] Invalid CMS data for slug:', slug, error.issues);
    } else {
      console.error('[Posts] Failed to fetch post:', slug, error);
    }
    return null;
  }
}
