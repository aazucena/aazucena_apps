import { describe, expect, it } from 'vitest';
import { wcagContrast } from 'culori';
import { chartTheme } from './chart';
import { d3Scales } from '../integrations/d3/scales';
import { generateCssVariables } from '../utils/generate-css';

const css = generateCssVariables('default');
const names = (value: unknown): string[] =>
  JSON.stringify(value)
    .match(/var\(--([a-z0-9-]+)/g)
    ?.map((m) => m.slice(6)) ?? [];

describe('chartTheme', () => {
  it('references only CSS variables the design system emits', () => {
    const used = names(chartTheme);
    expect(used.length).toBeGreaterThan(10);
    for (const name of used) expect(css, name).toMatch(new RegExp(`--${name}:`));
  });

  it('orders series as the locked categorical order', () => {
    expect(chartTheme.series).toEqual([
      'var(--series-1)',
      'var(--series-2)',
      'var(--series-3)',
      'var(--series-4)',
    ]);
  });

  it('backs the legacy d3Scales export with the same tokens', () => {
    expect(d3Scales.categorical).toEqual(chartTheme.series);
    expect(d3Scales.sequential).toEqual(chartTheme.seq);
    expect(d3Scales.diverging).toEqual(chartTheme.div);
  });
});

describe('labels on categorical fills', () => {
  // Pie and treemap labels sit on series fills in the panel color (`labelOn`), and on
  // the mixed tints in the foreground color, so both pairings must reach AA body text.
  const [light, dark] = css.split('\n.dark {');
  const value = (block: string, name: string) =>
    block.match(new RegExp(`--${name}: ([^;]+);`))![1]!.trim();

  it.each([
    ['light', light!],
    ['dark', dark!],
  ])('%s: panel text on every series reaches 4.5:1', (_mode, block) => {
    const panel = value(block, 'panel');
    for (const n of [1, 2, 3, 4]) {
      const series = value(block, `series-${n}`);
      expect(
        wcagContrast(series, panel),
        `series-${n} ${series} on ${panel}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
