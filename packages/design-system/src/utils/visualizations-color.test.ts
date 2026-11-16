import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Chart colors come from `chartTheme` (CSS variables), so charts follow the vibe and
 * light/dark mode. A literal color or a stock D3 scheme in @aazucena/visualizations
 * would pin one palette regardless of theme.
 */
const VIZ_DIR = join(__dirname, '../../../visualizations/src');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name) ? [full] : [];
  });
}

const FORBIDDEN: [string, RegExp][] = [
  ['stock D3 categorical scheme', /\bscheme[A-Z]\w+/],
  [
    'stock D3 color interpolator',
    /\binterpolate(Blues|Greens|Greys|Oranges|Purples|Reds|Viridis|Inferno|Magma|Plasma|Cividis|Turbo|Warm|Cool|Rainbow|Sinebow|Spectral|RdBu|RdYlBu|RdYlGn|BuGn|BuPu|GnBu|OrRd|PuBu|YlGn|YlOrRd)\b/,
  ],
  ['hex color literal', /['"`(\s,]#[0-9a-fA-F]{3,8}\b/],
  ['rgb()/rgba() literal', /\brgba?\(/],
  ['legacy --color-* variable', /var\(--color-/],
  ['named color literal', /['"](white|black)['"]/],
];

describe('@aazucena/visualizations colors', () => {
  it('uses chartTheme roles, never literal colors or stock D3 schemes', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(VIZ_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (/^\s*(\/\/|\*)/.test(line)) return;
          for (const [what, re] of FORBIDDEN) {
            if (re.test(line)) offenders.push(`${file.split('src/')[1]}:${i + 1} ${what}`);
          }
        });
    }
    expect(offenders).toEqual([]);
  });

  it('styles chart chrome with role variables, not stock Tailwind hues, glass or glow', () => {
    const STOCK =
      /\b(?:bg|text|border|ring|accent|from|to|via|shadow|fill|stroke)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|primary)-\d{2,3})\b|\bshadow-(?:sm|md|lg|xl|2xl)\b|\bbackdrop-blur|\brounded-(?:lg|xl|2xl|3xl|\[\d)/;
    const offenders: string[] = [];
    for (const file of sourceFiles(VIZ_DIR)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          const hit = line.match(STOCK);
          if (hit) offenders.push(`${file.split('src/')[1]}:${i + 1} ${hit[0]}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
