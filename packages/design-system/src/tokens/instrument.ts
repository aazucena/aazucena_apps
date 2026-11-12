/**
 * Design System Primitives: Instrument density and motion
 * Vibe-independent sizes from the Avra "instrument in air" language (Figma: Dimension).
 */

export const density = {
  'control-sm': '30px',
  'control-md': '36px',
  'control-lg': '44px',
  'panel-padding': '20px',
  'panel-header': '32px',
  'layout-gutter': '24px',
  'row-height': '36px',
} as const;

/** Durations; every animation using them is disabled under prefers-reduced-motion. */
export const motionTokens = {
  'motion-breath': '4000ms', // live-dot pulse, skeleton breath
  'motion-draw': '900ms', // chart line draw-in
  'motion-base': '200ms', // state changes
} as const;
