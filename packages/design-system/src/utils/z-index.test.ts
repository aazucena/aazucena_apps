import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateCssVariables } from './generate-css';
import { zIndex } from '../tokens/z-index';

/**
 * One stacking order for the library. Page-level layers in @aazucena/ui use the
 * z-index tokens (`z-(--z-modal)`), so a menu can't open under a sticky header
 * and apps can slot their own layers between the tiers.
 */
const css = generateCssVariables('default');
const UI_DIR = join(__dirname, '../../../ui/src/components');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? tsxFiles(full) : name.endsWith('.tsx') ? [full] : [];
  });
}

describe('z-index tokens', () => {
  it('emits every tier as a kebab-case custom property', () => {
    const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const missing = Object.entries(zIndex)
      .filter(([k, v]) => !css.includes(`--z-${kebab(k)}: ${v};`))
      .map(([k]) => `--z-${kebab(k)}`);
    expect(missing).toEqual([]);
  });

  it('emits no camelCase custom property names (CSS names are case-sensitive)', () => {
    expect(css.match(/--[a-z0-9-]*[A-Z][A-Za-z0-9-]*:/g) ?? []).toEqual([]);
  });
});

describe('@aazucena/ui stacking', () => {
  it('uses z-index tokens for page-level layers, not raw values', () => {
    // z-0..z-30 stack layers inside one component; anything from z-40 up is a page layer.
    const RAW_PAGE_LAYER = /(?:^|[\s'"`:])z-(?:40|50|\[\d{2,}\])(?=[\s'"`]|$)/;
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (RAW_PAGE_LAYER.test(line))
            offenders.push(`${file.split('src/components/')[1]}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
