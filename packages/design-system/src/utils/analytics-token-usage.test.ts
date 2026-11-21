import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard for the analytics app's Avra token usage. Every .tsx file under apps/analytics/src
 * must stay free of stock palette classes, glass, big radii and literal colours.
 */
const ROOT = join(__dirname, '../../../..');
const SRC = join(ROOT, 'apps/analytics/src');

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
  ['width cap', /\bmax-w-7xl\b/g],
  ['literal colour', /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(/g],
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return full === join(SRC, 'app/api') ? [] : sourceFiles(full);
    }
    return /\.tsx?$/.test(name) && !name.endsWith('.d.ts') ? [full] : [];
  });
}

const rel = (file: string) => relative(SRC, file).split(sep).join('/');

/** Drops block comments, whole-line `//` comments and trailing ` // ...` after code. `//` inside URLs has no leading space, so it survives. */
function stripComments(src: string): string {
  return src
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

describe('analytics app Avra token usage', () => {
  it('uses Avra tokens in every file', () => {
    for (const file of ALL) {
      expect({ file, hits: violations(file) }).toEqual({ file, hits: [] });
    }
  });

  it('loads Avra through ui globals', () => {
    const css = readFileSync(join(SRC, 'styles/globals.css'), 'utf8');
    expect(css).toMatch(/@import ['"]@aazucena\/ui\/globals\.css['"]/);
    expect(css).not.toMatch(/--(?:primary|secondary|neutral|destructive|success)-\d{2,3}\s*:/);
    expect(css).not.toMatch(/@theme inline/);
  });

  it('loads Fira and sets the theme before paint', () => {
    const layout = readFileSync(join(SRC, 'app/layout.tsx'), 'utf8');
    expect(layout).toMatch(/Fira_Sans/);
    expect(layout).toMatch(/Fira_Code/);
    expect(layout).not.toMatch(/Inter|JetBrains_Mono/);
    expect(layout).toMatch(/localStorage\.getItem\(['"]theme['"]\)/);
    expect(layout).toMatch(/suppressHydrationWarning/);
  });

  it('respects reduced motion', () => {
    const provider = readFileSync(join(SRC, 'providers/RootProvider.tsx'), 'utf8');
    expect(provider).toMatch(/<MotionConfig[^>]*reducedMotion="user"/);
  });
});
