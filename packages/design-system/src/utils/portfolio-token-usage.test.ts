import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard for the portfolio's Avra token usage. Every .astro, .tsx and .ts file under
 * apps/portfolio/src must stay free of stock palette classes, glass, big radii and literal colours.
 * SCENE_EXEMPT lists files whose literal colours are scene imagery (path -> reason); it never
 * covers panel or text styling.
 */
const ROOT = join(__dirname, '../../../..');
const SRC = join(ROOT, 'apps/portfolio/src');

const RULES: Array<[name: string, re: RegExp]> = [
  [
    'stock palette',
    /\b(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|placeholder|decoration|accent|caret|shadow)-(?:zinc|slate|gray|neutral|stone|rose|red|emerald|green|amber|yellow|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|orange|teal|lime|primary|secondary|destructive|success|warning|info)-\d{2,3}\b/g,
  ],
  [
    'white/black',
    /\b(?:bg|text|border|ring|fill|stroke|outline|divide|shadow|from|via|to)-(?:white|black)\b/g,
  ],
  ['glass', /\bbackdrop-blur\b/g],
  ['legacy variant', /variant=["'](?:cyber|glass|gradient)["']/g],
  ['big radius', /\brounded-(?:2xl|3xl|\[[^\]]+\])/g],
  ['surface shadow', /(?<!drop-)\bshadow-(?:sm|md|lg|xl|2xl)\b/g],
  ['literal colour', /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(/g],
  ['three hex', /\b0x[0-9a-fA-F]{6}\b/g],
];

/** Files whose literal colours are scene imagery. path -> one-line reason. */
const SCENE_EXEMPT: Record<string, string> = {
  'config/animations.ts':
    'particle fallback colours, used only when a signal or series token cannot be read',
  'components/homepage/overlays/AtmosphericOverlays.tsx':
    'sky dimming scrims and aurora tints over the scenes are atmospheric imagery, not panel styling',
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return full === join(SRC, 'pages/api') ? [] : sourceFiles(full);
    }
    return /\.(?:astro|tsx?)$/.test(name) && !/\.d\.ts$|\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

const rel = (file: string) => relative(SRC, file).split(sep).join('/');

/**
 * Drops block comments, HTML/Astro comments, whole-line `//` comments and trailing ` // ...`
 * after code. Astro frontmatter is code, so it is kept and only its comments go.
 * `//` inside URLs has no leading space, so it survives.
 */
function stripComments(src: string): string {
  return src
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .split('\n')
    .map((line) => (/^\s*\/\//.test(line) ? '' : line.replace(/\s\/\/[^'"`]*$/, '')))
    .join('\n');
}

export function violations(file: string): string[] {
  const code = stripComments(readFileSync(join(SRC, file), 'utf8'));
  return RULES.flatMap(([name, re]) => Array.from(code.matchAll(re), (m) => `${name}: ${m[0]}`));
}

const ALL = sourceFiles(SRC).map(rel).sort();
const CHECKED = ALL.filter((f) => !(f in SCENE_EXEMPT));

describe('portfolio Avra token usage', () => {
  it('uses Avra tokens in every file outside SCENE_EXEMPT', () => {
    for (const file of CHECKED) {
      expect({ file, hits: violations(file) }).toEqual({ file, hits: [] });
    }
  });

  it('gives every SCENE_EXEMPT entry an existing file and a reason', () => {
    for (const [file, reason] of Object.entries(SCENE_EXEMPT)) {
      expect({ file, exists: existsSync(join(SRC, file)) }).toEqual({ file, exists: true });
      expect({ file, reason: reason.trim().length > 0 }).toEqual({ file, reason: true });
    }
  });

  it('loads Avra through ui globals', () => {
    const css = readFileSync(join(SRC, 'styles/globals.css'), 'utf8');
    expect(css).toMatch(/@import ['"]@aazucena\/ui\/globals\.css['"]/);
    expect(css).not.toMatch(/--(?:primary|secondary|neutral|destructive|success)-\d{2,3}\s*:/);
    expect(css).not.toMatch(/@theme inline/);
  });

  it('keeps the homepage content dark', () => {
    const layout = readFileSync(join(SRC, 'layouts/HomeLayout.astro'), 'utf8');
    expect(layout).toMatch(/class(?::list)?=[^>]*\bdark\b/);
  });
});
