/**
 * Design System Primitives: Color Palette
 * Merges Tailwind CSS default colors with custom brand OKLCH scales.
 */

import tailwindColors from 'tailwindcss/colors';

export const colors = {
  // --- Tailwind Default Colors (Merged) ---
  ...tailwindColors,

  // --- Brand Overrides (Custom OKLCH) ---

  // Custom Zinc (Slightly cleaner in OKLCH)
  zinc: {
    50: 'oklch(0.98 0 0)',
    100: 'oklch(0.96 0 0)',
    200: 'oklch(0.91 0 0)',
    300: 'oklch(0.83 0 0)',
    400: 'oklch(0.71 0 0)',
    500: 'oklch(0.55 0 0)',
    600: 'oklch(0.44 0 0)',
    700: 'oklch(0.37 0 0)',
    800: 'oklch(0.27 0 0)',
    900: 'oklch(0.21 0 0)',
    950: 'oklch(0.14 0 0)',
  },

  // Primary Brand Scale (Cyan-based)
  primary: {
    50: 'oklch(0.97 0.02 215)',
    100: 'oklch(0.95 0.02 215)',
    200: 'oklch(0.90 0.05 215)',
    300: 'oklch(0.82 0.07 215)',
    400: 'oklch(0.73 0.09 215)',
    500: 'oklch(0.64 0.11 215)', // Main Brand Cyan
    600: 'oklch(0.56 0.09 215)',
    700: 'oklch(0.47 0.08 215)',
    800: 'oklch(0.38 0.06 215)',
    900: 'oklch(0.30 0.04 215)',
    950: 'oklch(0.23 0.02 215)',
  },

  // Secondary Brand Scale (Orange-based)
  secondary: {
    50: 'oklch(0.97 0.03 35)',
    100: 'oklch(0.95 0.05 35)',
    200: 'oklch(0.90 0.08 35)',
    300: 'oklch(0.82 0.11 35)',
    400: 'oklch(0.75 0.13 35)',
    500: 'oklch(0.69 0.15 35)', // Main Brand Orange
    600: 'oklch(0.63 0.16 35)',
    700: 'oklch(0.60 0.16 35)',
    800: 'oklch(0.50 0.14 35)',
    900: 'oklch(0.40 0.12 35)',
    950: 'oklch(0.30 0.10 35)',
  },

  // Destructive Scale (Red-based)
  destructive: {
    50: 'oklch(0.95 0.05 25)',
    100: 'oklch(0.90 0.10 25)',
    200: 'oklch(0.85 0.15 25)',
    300: 'oklch(0.78 0.18 25)',
    400: 'oklch(0.72 0.20 25)',
    500: 'oklch(0.66 0.22 25)', // Main Red
    600: 'oklch(0.60 0.22 25)',
    700: 'oklch(0.54 0.20 25)',
    800: 'oklch(0.48 0.18 25)',
    900: 'oklch(0.40 0.15 25)',
    950: 'oklch(0.32 0.12 25)',
  },

  // Success Scale (Green-based)
  success: {
    50: 'oklch(0.95 0.05 145)',
    100: 'oklch(0.90 0.10 145)',
    200: 'oklch(0.85 0.13 145)',
    300: 'oklch(0.80 0.16 145)',
    400: 'oklch(0.78 0.17 145)',
    500: 'oklch(0.75 0.18 145)', // Main Green
    600: 'oklch(0.70 0.18 145)',
    700: 'oklch(0.65 0.17 145)',
    800: 'oklch(0.55 0.15 145)',
    900: 'oklch(0.45 0.13 145)',
    950: 'oklch(0.35 0.10 145)',
  },
  // --- Avra instrument palette (Figma: Avra Design System / Primitives) ---

  // Ink: hue ~228 neutrals. 950/900/800/500/200 are the locked analytics surfaces.
  ink: {
    25: '#fbfeff',
    50: '#f5fbfe',
    100: '#e8f2f7',
    200: '#D7E6EC',
    300: '#c3d4dc',
    400: '#a6bbc6',
    500: '#7F9AA5',
    550: '#6b8591',
    600: '#536d79',
    700: '#3d5a67',
    800: '#24404C',
    850: '#192f38',
    900: '#13232B',
    950: '#0E1A20',
  },

  // Signal: brand cyan. 500 = dark-mode signal, 700 = light-mode signal.
  signal: {
    100: '#daf3fe',
    200: '#aee1f6',
    300: '#7acae9',
    400: '#53b5d9',
    500: '#32A0C5',
    600: '#1880a0',
    700: '#007493',
    800: '#0d556c',
    900: '#0d3b4b',
  },

  // Coral: alerts, anomalies, destructive. Never a series color.
  coral: { 300: '#f8b09b', 500: '#FF7B54', 700: '#ca4b23' },

  // Functional states (owner-chosen 2026-11-11): success = mint 170, warning = amber 80.
  mint: { 500: '#55c1a3', 700: '#007b62' },
  'avra-amber': { 500: '#d9a02c', 700: '#896100' },

  // Categorical series 2-4 (series 1 = signal). Namespaced: Tailwind owns olive/violet/rose.
  'avra-olive': { 500: '#889D37', 700: '#687c04' },
  'avra-violet': { 500: '#7C5BC5', 700: '#7a59c3' },
  'avra-rose': { 500: '#D4679F', 700: '#af457e' },
} as const;

export type ColorScale = keyof typeof colors;
export type ColorWeight =
  25 | 50 | 100 | 200 | 300 | 400 | 500 | 550 | 600 | 700 | 800 | 850 | 900 | 950;

/**
 * Get the color value from the tokens.
 * @param scale - The color scale (e.g., 'primary', 'zinc')
 * @param weight - The weight (e.g., 500)
 * @param alpha - Optional opacity value (0 to 1)
 */
export function getColor(scale: ColorScale, weight: ColorWeight = 500, alpha?: number): string {
  const scaleData = colors[scale] as Record<string | number, string>;
  if (!scaleData) return '';

  const baseColor = scaleData[weight] || scaleData[500] || scaleData['DEFAULT'] || '';

  if (alpha !== undefined && baseColor.startsWith('oklch(')) {
    // If it's already an oklch string, append the alpha channel
    return baseColor.replace(')', ` / ${alpha})`);
  }

  if (alpha !== undefined && baseColor) {
    // Hex (and any other) values: mix with transparent so alpha survives as a token
    return `color-mix(in oklch, ${baseColor} ${Math.round(alpha * 100)}%, transparent)`;
  }

  return baseColor;
}
