import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Token-usage guards over @aazucena/ui sources. The design system owns token semantics,
 * so misuse that the type system can't see is caught here.
 */
const UI_DIR = join(__dirname, '../../../ui/src/components/ui');

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? tsxFiles(full) : name.endsWith('.tsx') ? [full] : [];
  });
}

const LITERALS = /(['"`])((?:(?!\1)[^\\\n])*)\1/g;

describe('@aazucena/ui token usage', () => {
  it('uses bg-scrim only on overlays, never as a component surface (C2: scrim is translucent)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (/(^|[\s:])bg-scrim(\s|$)/.test(body!) && !/\b(inset-0|absolute)\b/.test(body!)) {
          offenders.push(`${file.split('components/ui/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

/** Variant keys whose element is a fill (bar, dot, rule, icon box): an empty value draws nothing. */
const FILL_VARIANTS: Array<[file: string, cva: string, keys: string[]]> = [
  ['progress.tsx', 'progressIndicatorVariants', ['default', 'cyber', 'glass', 'gradient']],
  ['separator.tsx', 'separatorVariants', ['gradient', 'cyber-gradient']],
  ['timeline.tsx', 'timelineDotVariants', ['default', 'primary', 'success', 'warning', 'danger']],
  ['timeline.tsx', 'timelineLineVariants', ['default', 'cyber']],
  ['hexagon-card.tsx', 'hexagonIconVariants', ['award', 'certification']],
  [
    'environment.tsx',
    'environmentAtmosphereVariants',
    ['exosphere', 'thermosphere', 'mesosphere', 'stratosphere', 'troposphere'],
  ],
];

describe('@aazucena/ui fill variants (I1)', () => {
  it.each(FILL_VARIANTS)('%s %s keeps a visible fill', (file, cvaName, keys) => {
    const src = readFileSync(join(UI_DIR, file), 'utf8');
    const start = src.indexOf(`const ${cvaName} = cva(`);
    expect(start, `${cvaName} not found`).toBeGreaterThan(-1);
    const block = src.slice(
      start,
      src.indexOf('\n});', start) > -1 ? src.indexOf('\n});', start) : start + 3000,
    );
    for (const key of keys) {
      const m = block.match(new RegExp(`['"]?${key}['"]?:\\s*\\n?\\s*'([^']*)'`));
      expect(m?.[1] ?? '', `${file} ${cvaName}.${key}`).toMatch(/\bbg-/);
    }
  });
});
