import { createHighlighter, type Highlighter, bundledLanguages } from 'shiki';

let highlighter: Highlighter | null = null;

/**
 * Get or create a singleton shiki highlighter instance
 */
export async function getHighlighter() {
  if (highlighter) return highlighter;

  highlighter = await createHighlighter({
    themes: [
      'andromeeda',
      'catppuccin-latte',
      'catppuccin-frappe',
      'github-light',
      'github-dark',
      'slack-ochin',
      'slack-dark',
      'snazzy-light',
      'nord',
      'one-light',
      'light-plus',
      'one-dark-pro',
      'material-theme',
      'material-theme-lighter',
    ],
    langs: Object.keys(bundledLanguages),
  });

  return highlighter;
}
