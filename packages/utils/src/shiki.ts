import { createHighlighter, type Highlighter } from 'shiki';

// Symbol.for() uses Node's global symbol registry — survives Vite's per-request
// module re-evaluation in SSR isolation contexts (unlike module-level `let`).
const SHIKI_KEY = Symbol.for('aazucena.shiki.highlighter');
type GlobalWithShiki = typeof globalThis & {
  [SHIKI_KEY]?: Promise<Highlighter>;
};

// Curated language list — avoids loading all 200+ bundledLanguages grammars.
// Each grammar is 50-500 KB; the full set consumes 100 MB+ in Chrome, causing
// OOM crashes in headless vitest runs. Extend this list as new languages appear
// in CMS content.
const SUPPORTED_LANGS = [
  'typescript', 'tsx', 'javascript', 'jsx',
  'css', 'scss', 'html',
  'json', 'jsonc', 'yaml', 'toml',
  'bash', 'sh', 'shell',
  'python', 'rust', 'go', 'sql',
  'markdown', 'mdx',
  'diff', 'text',
] as const;

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
      langs: [...SUPPORTED_LANGS],
    });
  }
  return g[SHIKI_KEY]!;
}
