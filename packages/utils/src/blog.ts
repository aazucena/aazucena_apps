/**
 * Blog-related utility functions
 */

import removeMd from 'remove-markdown';
import { truncate } from './string';

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

/**
 * Strips markdown from a post description and returns a plain-text excerpt.
 * Uses remove-markdown to handle nested formatting, code blocks, links, etc.
 */
export function getPostExcerpt(description: unknown, maxLength = 160): string {
  if (!description) return '';
  const plain = removeMd(String(description)).replace(/\s+/g, ' ').trim();
  return truncate(plain, maxLength);
}
