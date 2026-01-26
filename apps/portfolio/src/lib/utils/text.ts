/**
 * Text Utility Functions
 */

/**
 * Simple pluralization helper for English
 * @param word - Word to pluralize
 * @param count - Optional count to determine if pluralization is needed
 */
export function pluralize(word: string, count?: number): string {
  if (count === 1) return word;

  // Basic rules for common English plurals
  if (word.endsWith('y') && !/[aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  }
  
  return word + 's';
}

/**
 * Converts a string to Title Case (e.g., "HELLO WORLD" -> "Hello World")
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
