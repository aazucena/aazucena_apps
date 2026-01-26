/**
 * Blog Helpers - Utility functions for computed blog post fields
 */

/**
 * Calculate estimated reading time from content
 * @param content - Blog post content (blocks or markdown)
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string (e.g., "5 min read")
 */
export function calculateReadTime(content: any, wordsPerMinute = 200): string {
  if (!content) return '1 min read';

  let text = '';

  // Handle blocks content (array of block objects)
  if (Array.isArray(content)) {
    text = JSON.stringify(content);
  }
  // Handle string content (markdown or plain text)
  else if (typeof content === 'string') {
    text = content;
  }
  // Handle object with text property
  else if (typeof content === 'object' && content.text) {
    text = content.text;
  }

  // Count words (split by whitespace, filter empty strings)
  const wordCount = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return minutes === 1 ? '1 min read' : `${minutes} min read`;
}

/**
 * Format post date for display
 * Prioritizes: publishedAt > updatedAt > createdAt
 * @param post - Blog post object with date fields
 * @param format - Date format ('short' | 'long' | 'iso')
 * @returns Formatted date string
 */
export function formatPostDate(
  post: { publishedAt?: string; updatedAt?: string; createdAt: string },
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  const dateString = post.publishedAt || post.updatedAt || post.createdAt;
  const date = new Date(dateString);

  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'iso':
      return date.toISOString().split('T')[0]!; // YYYY-MM-DD
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Get display date for datetime attribute
 * Returns ISO string for proper datetime attribute
 */
export function getPostDateTime(post: { publishedAt?: string; updatedAt?: string; createdAt: string }): string {
  return post.publishedAt || post.updatedAt || post.createdAt;
}

/**
 * Extract plain text excerpt from blocks or markdown content
 * @param content - Blog post content
 * @param maxLength - Maximum character length (default: 160)
 * @returns Plain text excerpt
 */
export function extractExcerpt(content: any, maxLength = 160): string {
  if (!content) return '';

  let text = '';

  // Handle blocks content
  if (Array.isArray(content)) {
    // Find first paragraph block with text
    const firstParagraph = content.find(
      (block: any) => block.type === 'paragraph' && block.children
    );
    if (firstParagraph) {
      text = firstParagraph.children
        .map((child: any) => child.text || '')
        .join('');
    }
  }
  // Handle markdown string
  else if (typeof content === 'string') {
    text = content
      .replace(/^#+\s+/gm, '') // Remove markdown headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/`(.+?)`/g, '$1'); // Remove code
  }

  // Truncate to max length
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }

  return text;
}
