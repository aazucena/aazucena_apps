import { createHighlighter, type Highlighter } from 'shiki';

// Symbol.for() uses Node's global symbol registry — survives Vite's per-request
// module re-evaluation in SSR isolation contexts (unlike module-level `let`).
const SHIKI_KEY = Symbol.for('aazucena.shiki.highlighter');
type GlobalWithShiki = typeof globalThis & {
  [SHIKI_KEY]?: Promise<Highlighter>;
};

/**
 * Get or create a singleton shiki highlighter instance.
 * Safe across Vite SSR module isolation — uses the global symbol registry.
 */
export function getHighlighter(): Promise<Highlighter> {
  const g = globalThis as GlobalWithShiki;
  if (!g[SHIKI_KEY]) {
    g[SHIKI_KEY] = createHighlighter({
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
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'html',
        'css',
        'json',
        'markdown',
        'bash',
        'sh',
        'python',
        'rust',
        'go',
        'yaml',
        'toml',
        'sql',
        'text',
      ],
    });
  }
  return g[SHIKI_KEY]!;
}
