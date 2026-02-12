/**
 * Blog-related utility functions
 */

/**
 * Formats post date for display
 */
export function formatPostDate(post: { publishedAt: string }): string {
  if (!post.publishedAt) return '';
  return new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
