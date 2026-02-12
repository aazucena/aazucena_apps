import { slugify } from './string';
import type { TOCHeading } from '@aazucena/types';

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
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match && match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();

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
