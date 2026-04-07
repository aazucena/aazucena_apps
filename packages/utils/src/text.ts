/**
 * Text Utility Functions
 */

/**
 * Simple pluralization helper for English
 */
export function pluralize(word: string, count?: number): string {
  if (count === 1) return word;

  if (word.endsWith('y') && !/[aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies';
  }
  if (
    word.endsWith('s') ||
    word.endsWith('sh') ||
    word.endsWith('ch') ||
    word.endsWith('x') ||
    word.endsWith('z')
  ) {
    return word + 'es';
  }

  return word + 's';
}

/**
 * Converts a string to Title Case.
 *
 * Capitalises the first letter of each word delimited by spaces or `/`,
 * without lowercasing the rest of the string — so acronyms like "AI" and
 * "ML" are preserved, and compound words like "Hardware/Embedded" get both
 * halves capitalised.
 *
 * Examples:
 *   "hardware/embedded" → "Hardware/Embedded"
 *   "ai/ml"             → "Ai/Ml"   (input is already lowercase)
 *   "AI/ML"             → "AI/ML"   (casing preserved)
 *   "hello world"       → "Hello World"
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  // Split on spaces and forward-slashes, keeping the delimiters via capture group
  return str
    .split(/([ /])/)
    .map((segment) => {
      // Delimiters (' ' and '/') pass through unchanged
      if (segment === ' ' || segment === '/') return segment;
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join('');
}
