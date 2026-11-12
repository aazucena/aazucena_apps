import { describe, expect, it } from 'vitest';
import { formatHex, interpolate, wcagContrast } from 'culori';
import { generateCssVariables } from './generate-css';
import { deriveAliases } from './aliases';
import { vibes } from '../themes/registry';

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
    expect(read(rootBlock, 'alert')?.toLowerCase()).toBe('#c14319');
  });

  it('uses the owner-chosen success and warning colors', () => {
    expect(read(darkBlock, 'success')?.toLowerCase()).toBe('#55c1a3');
    expect(read(rootBlock, 'success')?.toLowerCase()).toBe('#00735b');
    expect(read(darkBlock, 'warning')?.toLowerCase()).toBe('#d9a02c');
    expect(read(rootBlock, 'warning')?.toLowerCase()).toBe('#855e00');
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

describe('shadcn aliases', () => {
  it('resolves the aliases Tailwind @theme references, in both modes', () => {
    for (const block of [rootBlock, darkBlock]) {
      expect(read(block, 'card')).toBe(read(block, 'panel'));
      expect(read(block, 'popover')).toBe(read(block, 'panel-raised'));
      expect(read(block, 'muted')).toBe(read(block, 'panel-raised'));
      expect(read(block, 'input')).toBe(read(block, 'rule-strong'));
      expect(read(block, 'ring')).toBe(read(block, 'signal'));
      expect(read(block, 'chart-1')).toBe(read(block, 'series-1'));
      expect(read(block, 'sidebar')).toBe(read(block, 'panel'));
      expect(read(block, 'sidebar-accent')).toBe(read(block, 'state'));
    }
  });

  it('falls back to legacy roles for vibes without instrument roles', () => {
    const aliases = deriveAliases(vibes['christmas']!.dark.colors);
    expect(aliases.card).toBe(vibes['christmas']!.dark.colors.cardBackground);
    expect(aliases.ring).toBe(vibes['christmas']!.dark.colors.primary);
    expect(aliases.input).toBe(vibes['christmas']!.dark.colors.border);
  });
});

describe('final review regressions', () => {
  it('keeps the state tone distinct from raised surfaces in both modes (C3)', () => {
    for (const block of [rootBlock, darkBlock]) {
      expect(read(block, 'state')).not.toBe(read(block, 'panel-raised'));
    }
  });

  it('keeps light-mode status text at AA on panel, background and its own tint (I2)', () => {
    const v = (n: string) => read(rootBlock, n)!;
    const tint = (c: string) => formatHex(interpolate([v('panel'), c], 'rgb')(0.15));
    expect(wcagContrast(v('alert'), v('panel'))).toBeGreaterThanOrEqual(4.5);
    expect(wcagContrast(v('alert'), v('background'))).toBeGreaterThanOrEqual(4.5);
    for (const role of ['success', 'warning']) {
      expect(wcagContrast(v(role), v('background')), role).toBeGreaterThanOrEqual(4.5);
      expect(wcagContrast(v(role), tint(v(role))), `${role} on tint`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
