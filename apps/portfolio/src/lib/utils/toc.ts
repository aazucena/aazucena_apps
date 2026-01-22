/**
 * Table of Contents (TOC) Utility
 * Extracts headings from markdown content for navigation
 */

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * Generates a slug from heading text (matches MarkdownRenderer logic)
 * @param text - The heading text
 * @returns Slugified text for use as an ID
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Extracts headings from markdown content
 * @param markdown - The markdown content string
 * @param maxLevel - Maximum heading level to include (default: 3 for H1-H3)
 * @returns Array of TOC headings
 */
export function extractTOC(markdown: string, maxLevel: number = 3): TOCHeading[] {
  if (!markdown) return [];

  const headings: TOCHeading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    // Match markdown headings (# H1, ## H2, ### H3, etc.)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();

      // Only include headings up to maxLevel
      if (level <= maxLevel) {
        headings.push({
          id: slugify(text),
          text,
          level,
        });
      }
    }
  }

  return headings;
}
