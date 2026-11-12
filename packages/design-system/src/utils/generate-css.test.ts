import { describe, expect, it } from 'vitest';
import { wcagContrast } from 'culori';
import { generateCssVariables } from './generate-css';

const css = generateCssVariables('default');
const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
const darkBlock = css.slice(css.indexOf('.dark {'));

/** Read a custom property's value from a CSS block. */
function read(block: string, name: string): string | undefined {
  const match = block.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return match?.[1]?.trim();
}

describe('default vibe: instrument tokens', () => {
  it('uses the locked ink surfaces in dark mode', () => {
    expect(read(darkBlock, 'background')?.toLowerCase()).toBe('#0e1a20');
    expect(read(darkBlock, 'panel')?.toLowerCase()).toBe('#13232b');
    expect(read(darkBlock, 'rule')?.toLowerCase()).toBe('#24404c');
  });

  it('maps signal and alert per mode', () => {
    expect(read(darkBlock, 'signal')?.toLowerCase()).toBe('#32a0c5');
    expect(read(darkBlock, 'alert')?.toLowerCase()).toBe('#ff7b54');
    expect(read(rootBlock, 'signal')?.toLowerCase()).toBe('#007493');
    expect(read(rootBlock, 'alert')?.toLowerCase()).toBe('#ca4b23');
  });

  it('uses the owner-chosen success and warning colors', () => {
    expect(read(darkBlock, 'success')?.toLowerCase()).toBe('#55c1a3');
    expect(read(rootBlock, 'success')?.toLowerCase()).toBe('#007b62');
    expect(read(darkBlock, 'warning')?.toLowerCase()).toBe('#d9a02c');
    expect(read(rootBlock, 'warning')?.toLowerCase()).toBe('#896100');
  });

  it('emits series, state, tint and chart tokens in both modes', () => {
    for (const block of [rootBlock, darkBlock]) {
      for (const name of [
        'series-1',
        'series-2',
        'series-3',
        'series-4',
        'state',
        'panel-raised',
        'rule-strong',
        'signal-faint',
        'signal-subtle',
        'signal-line',
        'scrim',
        'panel-glass',
        'success-subtle',
        'warning-subtle',
        'chart-seq-1',
        'chart-seq-5',
        'chart-div-low',
        'chart-div-mid',
        'chart-div-high',
        'chart-grid',
        'chart-axis',
      ]) {
        expect(read(block, name), name).toBeTruthy();
      }
    }
  });

  it('keeps selection (state) distinct from raised surfaces in light mode', () => {
    expect(read(rootBlock, 'state')).not.toBe(read(rootBlock, 'panel-raised'));
  });

  it('uses the round-2 radii', () => {
    expect(read(rootBlock, 'radius-card')).toBe('6px');
    expect(read(rootBlock, 'radius-button')).toBe('4px');
    expect(read(rootBlock, 'radius-badge')).toBe('4px');
    expect(read(rootBlock, 'radius-control')).toBe('4px');
  });

  it('emits density and motion tokens on :root', () => {
    expect(read(rootBlock, 'control-md')).toBe('36px');
    expect(read(rootBlock, 'row-height')).toBe('36px');
    expect(read(rootBlock, 'layout-gutter')).toBe('24px');
    expect(read(rootBlock, 'panel-padding')).toBe('20px');
    expect(read(rootBlock, 'motion-breath')).toBe('4000ms');
  });

  it('has no achromatic neutrals and no drop shadow in the semantic layer', () => {
    const semantic = (block: string) => block.slice(block.indexOf('/* Semantic Variables */'));
    for (const block of [rootBlock, darkBlock]) {
      expect(semantic(block)).not.toMatch(/oklch\([\d.]+ 0 0/);
      expect(read(semantic(block), 'shadow')).toBe('none');
    }
  });

  it('passes WCAG AA for text pairs in both modes', () => {
    for (const block of [rootBlock, darkBlock]) {
      const v = (n: string) => read(block, n)!;
      expect(wcagContrast(v('foreground'), v('background'))).toBeGreaterThanOrEqual(4.5);
      expect(wcagContrast(v('muted-foreground'), v('panel'))).toBeGreaterThanOrEqual(4.5);
      expect(wcagContrast(v('signal-foreground'), v('signal'))).toBeGreaterThanOrEqual(4.5);
      expect(wcagContrast(v('rule-strong'), v('panel'))).toBeGreaterThanOrEqual(3);
    }
  });
});
