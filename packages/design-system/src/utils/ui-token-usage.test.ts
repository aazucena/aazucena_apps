import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Token-usage guards over @aazucena/ui sources. The design system owns token semantics,
 * so misuse that the type system can't see is caught here.
 */
// All of components/, not just components/ui: preloader/ sat outside the old scope
const UI_DIR = join(__dirname, '../../../ui/src/components');
const STORIES_DIR = join(__dirname, '../../../../apps/storybook/stories');

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

  // Accessibility audit 2026-11-13, finding 2 (WCAG 1.4.3): 1,326 text elements failed
  // contrast because the text itself was dimmed. Quiet text is `text-muted-foreground`.
  it('never dims text with opacity or a translucent text color', () => {
    const TEXTY =
      /text-(\[|xs|sm|base|lg|xl|\dxl)|uppercase|italic|font-(mono|black|bold|medium|semibold)|tracking-|leading-|truncate|line-clamp/;
    const DIM = /(?:^|\s)opacity-(?:10|20|30|40|50|60)(?=\s|$)/;
    const ALPHA_TEXT =
      /(?:^|[\s:])text-(?:(?:foreground|muted-foreground|current)\/(?:[1-6]0|5)|(?:signal|primary|alert|success|warning|destructive)\/\d+)(?=\s|$)/;
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        // Disabled controls are exempt from the contrast minimum.
        if (/disabled|not-allowed/.test(body!)) continue;
        if (ALPHA_TEXT.test(body!) || (DIM.test(body!) && TEXTY.test(body!))) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  // Role text on its own tint is tested to 15% over the background (generate-css.test.ts).
  // On a panel the same tint is darker, so components stay at 10%.
  it('keeps the tint under signal and status text at 10% or lighter', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (
          /text-(signal|primary|alert|success|warning|destructive)(?![-/\w])/.test(body!) &&
          /bg-(signal|primary|alert|success|warning|destructive)\/(?:1[1-9]|[2-9]\d)(?!\d)/.test(
            body!,
          )
        ) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  // Accessibility audit 2026-11-13, finding 4 (WCAG 2.4.7): a control that removes the
  // browser outline must show focus another way. Menu items show it with a fill.
  it('replaces every removed outline with a visible focus style', () => {
    const REMOVES = /(?:^|[\s:])outline-(?:none|hidden)(?=\s|$)/;
    const SHOWS =
      /focus(?:-visible|-within)?:(?:ring|outline-(?:1|2|signal|ring)|border|bg-|text-|underline)|has-\[[^\]]*focus[^\]]*\]:ring|data-\[selected|data-active|isActive/;
    // Containers that take programmatic focus only (dialog-like surfaces), or an inner
    // field whose wrapper shows the ring with focus-within.
    const ALLOWED = [
      'ui/popover.tsx',
      'ui/hover-card.tsx',
      'ui/code-block-command.tsx',
      'ui/number-input.tsx',
      'ui/phone-input.tsx',
      'ui/command.tsx',
      'ui/mention-input.tsx',
      'ui/editor.tsx',
      'ui/tags-input.tsx',
      'ui/search-input.tsx',
      'ui/transfer.tsx',
      'ui/input-group.tsx',
    ];
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const rel = file.split('src/components/')[1]!;
      if (ALLOWED.includes(rel)) continue;
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (REMOVES.test(body!) && !SHOWS.test(body!))
          offenders.push(`${rel}: ${body!.slice(0, 80)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('shows focus on the wrapper of every field that hides its own outline', () => {
    for (const rel of [
      'number-input',
      'phone-input',
      'command',
      'mention-input',
      'editor',
      'tags-input',
      'search-input',
      'transfer',
    ]) {
      const src = readFileSync(join(UI_DIR, 'ui', `${rel}.tsx`), 'utf8');
      expect(src, rel).toMatch(/focus-within:outline-signal/);
    }
  });

  it('pairs every solid accent fill with accent text', () => {
    const offenders: string[] = [];
    for (const file of tsxFiles(UI_DIR)) {
      const src = readFileSync(file, 'utf8');
      for (const [, , body] of src.matchAll(LITERALS)) {
        if (/(?:^|\s)bg-accent(?=\s|$)/.test(body!) && !/text-accent-foreground/.test(body!)) {
          offenders.push(`${file.split('src/components/')[1]}: ${body!.slice(0, 80)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('styles Radix states with data-[state=…], not bare data-open/closed/checked/active shorthands', () => {
    // Radix sets data-state="open|closed|checked|…"; a bare data-open: compiles to [data-open], which never matches.
    for (const file of [...tsxFiles(UI_DIR), ...tsxFiles(STORIES_DIR)]) {
      const src = readFileSync(file, 'utf8');
      const hits =
        src.match(
          /\bdata-(?:open|closed|checked|unchecked|active|inactive|visible|hidden)(?=[:/])/g,
        ) ?? [];
      const name = file.split('src/components/')[1] ?? file.split('apps/storybook/')[1];
      expect({ file: name, hits }).toEqual({ file: name, hits: [] });
    }
  });
});
