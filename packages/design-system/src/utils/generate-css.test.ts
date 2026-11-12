import { describe, expect, it } from 'vitest';
import { formatHex, interpolate, parse, wcagContrast } from 'culori';
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
    expect(aliases.ring).toBe(
      vibes['christmas']!.dark.colors.signal ?? vibes['christmas']!.dark.colors.primary,
    );
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

describe('every vibe brings its own accent (I4)', () => {
  /** Flatten a possibly translucent color onto the surface beneath it. */
  const solid = (color: string, under: string): string => {
    const c = parse(color);
    if (!c) throw new Error(`unparseable color: ${color}`);
    const a = c.alpha ?? 1;
    if (a >= 1) return formatHex(c)!;
    return formatHex(interpolate([solid(under, '#ffffff'), { ...c, alpha: 1 }], 'rgb')(a))!;
  };

  for (const id of Object.keys(vibes)) {
    const vibeCss = generateCssVariables(id);
    const blocks = {
      light: vibeCss.slice(vibeCss.indexOf(':root {'), vibeCss.indexOf('.dark {')),
      dark: vibeCss.slice(vibeCss.indexOf('.dark {')),
    };
    for (const [mode, block] of Object.entries(blocks)) {
      it(`${id} ${mode}: emits signal roles and instrument surfaces at AA`, () => {
        for (const name of [
          'signal',
          'signal-foreground',
          'signal-faint',
          'signal-subtle',
          'signal-line',
          'panel',
          'panel-raised',
          'rule',
          'rule-strong',
          'state',
        ]) {
          expect(read(block, name), name).toBeTruthy();
        }
        // Roles a vibe omits fall back to the default vibe's static CSS, as in the browser
        const v = (n: string) =>
          read(block, n) ?? read(mode === 'dark' ? darkBlock : rootBlock, n)!;
        const bg = solid(v('background'), '#ffffff');
        const panel = solid(v('panel'), bg);
        const signal = solid(v('signal'), panel);
        expect(
          wcagContrast(v('signal-foreground'), signal),
          'signal-foreground on signal',
        ).toBeGreaterThanOrEqual(4.5);
        expect(wcagContrast(signal, panel), 'signal text on panel').toBeGreaterThanOrEqual(4.5);
        expect(
          wcagContrast(solid(v('alert'), panel), panel),
          'alert text on panel',
        ).toBeGreaterThanOrEqual(4.5);
        const subtle = formatHex(interpolate([panel, signal], 'rgb')(0.15))!;
        expect(
          wcagContrast(solid(v('foreground'), panel), subtle),
          'foreground on signal-subtle',
        ).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('lets seasonal vibes differ from the default signal', () => {
    const sig = (id: string) =>
      read(generateCssVariables(id).slice(generateCssVariables(id).indexOf('.dark {')), 'signal');
    for (const id of Object.keys(vibes).filter((v) => v !== 'default')) {
      expect(sig(id), id).not.toBe(sig('default'));
    }
  });
});
