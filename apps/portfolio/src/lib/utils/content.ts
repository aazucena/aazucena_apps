/**
 * Content Helper Utilities
 * Functions for formatting and calculating content-related data (posts, awards, etc.)
 */

/**
 * Calculate reading time from content
 * Returns formatted string like "5 min read" or "1 min read"
 * @param content - Text content (plain text or richtext)
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 */
export function calculateReadTime(content: string | any, wordsPerMinute: number = 200): string {
  let text = '';

  // Handle different content types
  if (typeof content === 'string') {
    text = content;
  } else if (typeof content === 'object' && content !== null) {
    // Handle Strapi Blocks/RichText format
    text = extractTextFromBlocks(content);
  }

  // Count words
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Calculate minutes (round up)
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return 'Less than 1 min read';
  }

  return `${minutes} min read`;
}

/**
 * Extract plain text from Strapi Blocks content
 */
function extractTextFromBlocks(blocks: any): string {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map(block => {
      if (block.type === 'paragraph' || block.type === 'heading') {
        return block.children
          ?.map((child: any) => child.text || '')
          .join(' ') || '';
      }
      if (block.type === 'list') {
        return block.children
          ?.map((item: any) =>
            item.children
              ?.map((child: any) => child.text || '')
              .join(' ')
          )
          .join(' ') || '';
      }
      return '';
    })
    .join(' ');
}

/**
 * Generate deterministic gradient for award badges
 * Hashes award ID or type to consistently return the same gradient
 */
export function getAwardGradient(input: string): string {
  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-purple-400 to-pink-500',
    'from-emerald-400 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-indigo-400 to-violet-500',
    'from-rose-400 to-red-500',
    'from-amber-400 to-orange-600',
    'from-lime-400 to-green-500',
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % gradients.length;
  return gradients[index]!;
}

/**
 * Format date for display
 * Returns formatted string like "Jan 2020" or "Present"
 */
export function formatDate(date?: string, isCurrent?: boolean): string {
  if (isCurrent) {
    return 'Present';
  }

  if (!date) {
    return '';
  }

  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short'
  };

  return dateObj.toLocaleDateString('en-US', options);
}
