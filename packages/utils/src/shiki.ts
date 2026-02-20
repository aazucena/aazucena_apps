import { createHighlighter, type Highlighter, bundledLanguages } from 'shiki';

let highlighter: Highlighter | null = null;

/**
 * Get or create a singleton shiki highlighter instance
 */
export async function getHighlighter() {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: ['github-dark', 'nord', 'dracula', 'one-dark-pro'],
    langs: Object.keys(bundledLanguages),
  });

  return highlighter;
}
