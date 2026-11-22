import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  fontVariablesCss,
  googleFontsUrl,
  safeFontName,
} from '../../../../apps/portfolio/src/lib/utils/fonts';

/**
 * Regression guard for the Fira Sans loss in d0e46dc4: BaseLayout set the font variables through
 * `define:vars`, which never produced a working `--font-sans`, so the site fell back to system
 * fonts. The variables now come from plain CSS built from validated CMS names.
 */
const SRC = join(__dirname, '../../../..', 'apps/portfolio/src');

describe('portfolio fonts', () => {
  it('resolves every font variable to Fira with the default config', () => {
    const css = fontVariablesCss({
      sans: 'Fira Sans',
      serif: 'Fira Sans',
      heading: 'Fira Sans',
      code: 'Fira Code',
    });
    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/--font-sans: "Fira Sans",/);
    expect(css).toMatch(/--font-heading: "Fira Sans",/);
    expect(css).toMatch(/--font-serif: "Fira Sans",/);
    expect(css).toMatch(/--font-code: "Fira Code",/);
    expect(css).toMatch(/--font-mono: var\(--font-code\);/);
    expect(css).not.toMatch(/var\(--font(?:Sans|Serif|Heading|Code)\)/);
  });

  it('keeps a CMS family and falls back to Fira for unsafe or empty names', () => {
    expect(safeFontName('Inter', 'Fira Sans')).toBe('Inter');
    expect(safeFontName('IBM Plex-Sans 2', 'Fira Sans')).toBe('IBM Plex-Sans 2');
    for (const bad of [
      '',
      '  ',
      'x"; } body { display:none',
      'a</style><script>',
      'Fira;Sans',
      "A'B",
      undefined,
    ]) {
      expect(safeFontName(bad as string | undefined, 'Fira Sans')).toBe('Fira Sans');
    }
    const css = fontVariablesCss({ sans: 'x"; } *{display:none', code: '' });
    expect(css).not.toMatch(/display:none/);
    expect(css).toMatch(/--font-sans: "Fira Sans",/);
    expect(css).toMatch(/--font-code: "Fira Code",/);
  });

  it('requests every weight in use and builds one validated URL', () => {
    const url = googleFontsUrl({
      sans: 'Fira Sans',
      serif: 'Fira Sans',
      heading: 'Fira Sans',
      code: 'Fira Code',
    });
    expect(url).toContain('family=Fira+Sans:wght@300;400;500;600;700;900');
    expect(url).toContain('family=Fira+Code:wght@400;500');
    expect(url).toMatch(/&display=swap$/);
    expect(googleFontsUrl({ sans: 'a&b=c' })).not.toMatch(/a&b/);
  });

  it('does not use define:vars for fonts in BaseLayout, and the links share one URL', () => {
    const layout = readFileSync(join(SRC, 'layouts/BaseLayout.astro'), 'utf8');
    expect(layout).not.toMatch(/define:vars/);
    expect(layout).not.toMatch(/var\(--fontSans\)/);
    expect(layout).toMatch(/set:html=\{fontCss\}/);
    expect(layout.match(/href=\{fontsUrl\}/g)).toHaveLength(2);
  });

  it('styles headings from --font-heading', () => {
    const css = readFileSync(join(SRC, 'styles/globals.css'), 'utf8');
    expect(css).toMatch(
      /h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{\s*font-family: var\(--font-heading\)/,
    );
  });
});
