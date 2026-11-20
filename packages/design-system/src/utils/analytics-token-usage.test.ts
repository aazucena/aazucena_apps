import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Ratcheting guard for the analytics app's move onto the Avra design system.
 * Files in PENDING still carry stock palette classes, glass, big radii or literal colours.
 * Each restyle removes its files from PENDING; a finished file that regresses fails test 1,
 * and a listed file that is already clean fails test 2, so the list only shrinks.
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
  ['big radius', /\brounded-(?:2xl|3xl|\[[^\]]+\])/g],
  ['surface shadow', /(?<!drop-)\bshadow-(?:sm|md|lg|xl|2xl)\b/g],
  ['width cap', /\bmax-w-7xl\b/g],
  ['literal colour', /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(/g],
];

/** Paths relative to apps/analytics/src, POSIX separators, sorted. */
export const PENDING = new Set<string>([
  'app/(dashboard)/ai/costs/page.tsx',
  'app/(dashboard)/ai/page.tsx',
  'app/(dashboard)/ai/prompts/page.tsx',
  'app/(dashboard)/ai/trajectories/page.tsx',
  'app/(dashboard)/easter-eggs/page.tsx',
  'app/(dashboard)/error.tsx',
  'app/(dashboard)/finance/page.tsx',
  'app/(dashboard)/forms/page.tsx',
  'app/(dashboard)/journey/page.tsx',
  'app/(dashboard)/loading.tsx',
  'app/(dashboard)/logs/page.tsx',
  'app/(dashboard)/music/page.tsx',
  'app/(dashboard)/performance/page.tsx',
  'app/(dashboard)/traffic/page.tsx',
  'app/error.tsx',
  'app/not-found.tsx',
  'app/status/page.tsx',
  'components/common/ConfirmationModal.tsx',
  'components/common/LoginOverlay.tsx',
]);

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      return full === join(SRC, 'app/api') ? [] : tsxFiles(full);
    }
    return name.endsWith('.tsx') ? [full] : [];
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

const ALL = tsxFiles(SRC).map(rel).sort();

describe('analytics app Avra token usage', () => {
  it('uses Avra tokens in every finished file', () => {
    for (const file of ALL.filter((f) => !PENDING.has(f))) {
      expect({ file, hits: violations(file) }).toEqual({ file, hits: [] });
    }
  });

  it('lists only files that still need work', () => {
    for (const file of PENDING) {
      expect({ file, exists: existsSync(join(SRC, file)) }).toEqual({ file, exists: true });
      expect({ file, dirty: violations(file).length > 0 }).toEqual({ file, dirty: true });
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
