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
} as const;

export type ColorScale = keyof typeof colors;
export type ColorWeight = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

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

  return baseColor;
}
