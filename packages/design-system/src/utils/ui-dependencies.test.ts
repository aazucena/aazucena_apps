import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

// Statement-anchored forms only, so a package name inside a comment or string never counts
const PATTERNS = [
  /^\s*import\s[^'"]*?from\s*['"]([^'"]+)['"]/gm,
  /^\s*import\s*['"]([^'"]+)['"]/gm,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  /^\s*export\s[^'"]*?from\s*['"]([^'"]+)['"]/gm,
  /^\s*@import\s+['"]([^'"]+)['"]/gm,
  /^\s*@plugin\s+['"]([^'"]+)['"]/gm,
];

function packageName(spec: string): string | null {
  if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) return null;
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!;
}

/** Package name -> the ui files that import it. */
export function bareImports(dir: string): Map<string, Set<string>> {
  const found = new Map<string, Set<string>>();
  for (const file of sourceFiles(dir)) {
    const src = readFileSync(file, 'utf8')
      .split('\n')
      .filter((line) => !/^\s*(\/\/|\/?\*)/.test(line))
      .join('\n');
    for (const pattern of PATTERNS) {
      for (const match of src.matchAll(pattern)) {
        const name = packageName(match[1]!);
        if (!name) continue;
        if (!found.has(name)) found.set(name, new Set());
        found.get(name)!.add(file.slice(dir.length + 1));
      }
    }
  }
  return found;
}

describe('@aazucena/ui dependencies', () => {
  it('declares every package ui imports (deps or peers)', () => {
    const declared = { ...pkg.dependencies, ...pkg.peerDependencies };
    const missing = [...bareImports(UI_SRC).keys()]
      .filter((n) => !declared[n])
      .filter((n) => n !== 'tailwindcss-animate'); // removed in Task 2
    expect(missing).toEqual([]);
  });

  it('lists no runtime dependency ui never imports', () => {
    const used = bareImports(UI_SRC);
    const KEEP = [
      '@tailwindcss/postcss', // exported postcss.config.js
      'tw-animate-css', // imported from Task 2
    ];
    const unused = Object.keys(pkg.dependencies).filter((n) => !used.has(n) && !KEEP.includes(n));
    expect(unused).toEqual([]);
  });

  it('declares react and react-dom as peers, not dependencies', () => {
    expect(pkg.peerDependencies).toMatchObject({ react: '^19.0.0', 'react-dom': '^19.0.0' });
    expect(pkg.dependencies.react).toBeUndefined();
  });
});
