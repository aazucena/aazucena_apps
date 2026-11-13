import { describe, expect, it } from 'vitest';
import { fontSizes } from '../tokens/typography';
import tailwindPreset from '../tailwind';

/**
 * The type scale has one source of truth: the Figma text styles in the Avra
 * Design System file. Components are written against Tailwind's stock size keys
 * (Button's `text-sm` is Figma's 14px Label/Button), and the apps render stock
 * sizes, so the preset must not redefine those keys. Before 2026-11-13 it shifted
 * them one step down (`text-xs` 10px), so Storybook rendered everything a size
 * smaller than Figma and the apps.
 */
const STOCK_KEYS = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
];

/** Figma text styles (Avra Design System, read 2026-11-13). */
const FIGMA: Record<string, number> = {
  h1: 30, // Heading/H1
  h2: 24, // Heading/H2
  h3: 20, // Heading/H3
  h4: 18, // Heading/H4
  h5: 16, // Heading/H5
  h6: 14, // Heading/H6
  body: 14, // Body/Default
  caption: 12, // Body/Caption
};

const px = (v: unknown) => parseFloat(String(Array.isArray(v) ? v[0] : v));

describe('type scale', () => {
  it("doesn't redefine Tailwind's stock size keys", () => {
    const overridden = STOCK_KEYS.filter((k) => k in fontSizes);
    expect(overridden).toEqual([]);
    const presetSizes = (tailwindPreset.theme?.extend as Record<string, unknown>)?.fontSize ?? {};
    expect(STOCK_KEYS.filter((k) => k in (presetSizes as object))).toEqual([]);
  });

  it.each(Object.entries(FIGMA))(
    'named size %s matches the Figma text style (%ipx)',
    (key, size) => {
      expect(px(fontSizes[key as keyof typeof fontSizes])).toBe(size);
    },
  );
});
