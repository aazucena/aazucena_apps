import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateCssVariables, generateStructuralCss } from './generate-css';

/**
 * `@aazucena/ui` components read stacking, density and motion tokens through `var()`.
 * Apps that don't load the full `css-vars.css` import `@aazucena/ui/structure.css`
 * instead, a committed copy of those tokens. These tests keep the copy current and
 * make sure the apps that render ui components load one of the two files.
 */
const ROOT = join(__dirname, '../../../..');
const STRUCTURE_FILE = join(ROOT, 'packages/ui/src/styles/structure.css');
const UI_DIR = join(ROOT, 'packages/ui/src/components');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? tsxFiles(full) : name.endsWith('.tsx') ? [full] : [];
  });
}

describe('structural tokens', () => {
  it('keeps @aazucena/ui/structure.css equal to the generated tokens', () => {
    // Regenerate: pnpm --filter @aazucena/design-system ds:structure
    expect(readFileSync(STRUCTURE_FILE, 'utf8')).toBe(generateStructuralCss());
  });

  it('is a subset of css-vars.css, with the same values', () => {
    const full = generateCssVariables('default');
    const lines = generateStructuralCss()
      .split('\n')
      .filter((l) => l.trim().startsWith('--'));
    expect(lines.length).toBeGreaterThan(10);
    expect(lines.filter((l) => !full.includes(l))).toEqual([]);
  });

  it('defines every stacking, density and motion token ui components reference', () => {
    const structure = generateStructuralCss();
    const missing = new Set<string>();
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, name] of src.matchAll(
        /(--(?:z|motion|control|panel-padding|panel-header)[a-z0-9-]*)\)/g,
      )) {
        if (!structure.includes(`${name}:`)) missing.add(name!);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it.each([
    ['portfolio', 'apps/portfolio/src/styles/globals.css'],
    ['analytics', 'apps/analytics/src/styles/globals.css'],
    ['storybook', 'apps/storybook/styles/globals.css'],
  ])('%s loads the tokens ui components need', (_app, file) => {
    const css = readFileSync(join(ROOT, file), 'utf8');
    expect(css).toMatch(
      /@import\s+['"]@aazucena\/(ui\/(structure|globals)\.css|design-system\/css-vars\.css)['"]/,
    );
  });
});
