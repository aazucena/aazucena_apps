/**
 * Blog Helpers - Utility functions for computed blog post fields
 *
 * Note: calculateReadTime, formatPostDate → @aazucena/utils
 */

/**
 * Get display date for datetime attribute
 * Returns the most recent date for use in <time datetime="...">
 */
export function getPostDateTime(post: {
  publishedAt?: string;
  updatedAt?: string;
  createdAt: string;
}): string {
  return post.publishedAt || post.updatedAt || post.createdAt;
}
