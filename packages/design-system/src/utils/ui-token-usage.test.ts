import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Token-usage guards over @aazucena/ui sources. The design system owns token semantics,
 * so misuse that the type system can't see is caught here.
 */
// All of components/, not just components/ui: preloader/ sat outside the old scope
const UI_DIR = join(__dirname, '../../../ui/src/components');

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
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('hovers with the state tone, not a solid accent fill (hover:bg-accent needs accent text)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (/hover:bg-accent\b/.test(body!) && !/hover:text-accent-foreground\b/.test(body!)) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('keeps a gradient utility wherever gradient stops are set (the sweep stripped some)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (/(^|\s)from-\S/.test(body!) && !/\bbg-(gradient|linear|radial|conic)-?/.test(body!)) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('never sets text in translucent signal (it falls to 2-3:1 on panels)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/text-signal\/\d+/.test(line))
            offenders.push(`${file.split('src/components/')[1]}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });

  it('keeps text-bearing controls and labels square (no pills: rounded-full with padding)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (/(^|\s)rounded-full(\s|$)/.test(body!) && /(^|\s)px-(\d|\[)/.test(body!)) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('uses the signal token instead of stock Tailwind cyan', () => {
    // Swatch palettes are data the user picks from, not chrome
    const allowed = [/^\s*'#06b6d4',$/];
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (!/\bcyan-\d|rgba\(6,\s*182,\s*212|rgba\(34,\s*211,\s*238|#06b6d4/.test(line)) return;
          if (allowed.some((re) => re.test(line))) return;
          offenders.push(`${file.split('src/components/')[1]}:${i + 1}`);
        });
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
    const src = readFileSync(join(UI_DIR, 'ui', file), 'utf8');
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

  it('uses the motion token for state changes, never a raw short duration', () => {
    // 500ms and up are deliberate slow moves (fills, reveals); anything shorter is a state change.
    const RAW_SHORT = /(?:^|[\s:'"`])duration-(?:75|100|150|200|300)(?=[\s'"`]|$)/;
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (RAW_SHORT.test(line)) offenders.push(`${file.split('src/components/')[1]}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });

  it('never transitions every property (transition-all also fades colors on theme toggle)', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/(?:^|[\s:'"`])transition-all(?=[\s'"`]|$)/.test(line))
            offenders.push(`${file.split('src/components/')[1]}:${i + 1}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
