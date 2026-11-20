import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * @aazucena/ui is distributed through a shadcn registry, so its package.json has to declare
 * exactly what src imports: nothing missing, nothing left over from earlier experiments.
 */
const ROOT = join(__dirname, '../../../..');
const UI_SRC = join(ROOT, 'packages/ui/src');
const pkg = JSON.parse(readFileSync(join(ROOT, 'packages/ui/package.json'), 'utf8'));

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css)$/.test(name) ? [full] : [];
  });
}

// CSS has no parser here, so its two forms are matched at the start of a line, outside comments
const CSS_PATTERNS = [/^\s*@import\s+['"]([^'"]+)['"]/gm, /^\s*@plugin\s+['"]([^'"]+)['"]/gm];

/**
 * Module specifiers a file imports. TypeScript's own pre-processor reads .ts/.tsx, so imports,
 * re-exports and import() count, and import-like text in comments or template strings doesn't.
 */
function specifiers(file: string): string[] {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.css')) {
    const code = text.replace(/\/\*[\s\S]*?\*\//g, '');
    return CSS_PATTERNS.flatMap((p) => [...code.matchAll(p)].map((m) => m[1]!));
  }
  return ts.preProcessFile(text, true, true).importedFiles.map((f) => f.fileName);
}

function packageName(spec: string): string | null {
  if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) return null;
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!;
}

/** Package name -> the ui files that import it. */
export function bareImports(dir: string): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>();
  for (const file of sourceFiles(dir)) {
    for (const spec of specifiers(file)) {
      const name = packageName(spec);
      if (!name) continue;
      if (!found.has(name)) found.set(name, new Set());
      found.get(name)!.add(file.slice(dir.length + 1));
    }
  }
  return found;
}

describe('@aazucena/ui dependencies', () => {
  it('declares every package ui imports (deps or peers)', () => {
    const declared = { ...pkg.dependencies, ...pkg.peerDependencies };
    const missing = [...bareImports(UI_SRC).keys()].filter((n) => !declared[n]);
    expect(missing).toEqual([]);
  });

  it('lists no runtime dependency ui never imports', () => {
    const used = bareImports(UI_SRC);
    const KEEP = [
      '@tailwindcss/postcss', // exported postcss.config.js
    ];
    const unused = Object.keys(pkg.dependencies).filter((n) => !used.has(n) && !KEEP.includes(n));
    expect(unused).toEqual([]);
  });

  it.each([
    'packages/ui/src/styles/globals.css',
    'apps/analytics/src/styles/globals.css',
    'apps/portfolio/src/styles/globals.css',
  ])('%s animates with tw-animate-css', (file) => {
    const css = readFileSync(join(ROOT, file), 'utf8');
    expect(css).not.toMatch(/@plugin\s+['"]tailwindcss-animate['"]/);
    // tw-animate-css builds on Tailwind's layers, so it has to come right after tailwindcss
    expect(css).toMatch(/@import\s+['"]tailwindcss['"];\s*@import\s+['"]tw-animate-css['"]/);
  });

  it('declares react and react-dom as peers, not dependencies', () => {
    expect(pkg.peerDependencies).toMatchObject({ react: '^19.0.0', 'react-dom': '^19.0.0' });
    expect(pkg.dependencies.react).toBeUndefined();
  });

  it('declares zod as an optional peer, for the zodValidator that form.tsx re-exports', () => {
    expect(bareImports(UI_SRC).has('@tanstack/zod-form-adapter')).toBe(true);
    expect(pkg.peerDependencies.zod).toBe('^4.0.0');
    expect(pkg.peerDependenciesMeta?.zod).toEqual({ optional: true });
  });
});
