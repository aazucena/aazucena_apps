import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Scalar OpenAPI Theme Configuration
 * Maps brand tokens to Scalar's CSS variables for interactive API documentation.
 */
export const scalarTheme = {
  /** Generated CSS string for Scalar theme injection */
  css: `
    :root {
      --scalar-color-1: ${toHex(colors.zinc[100])};
      --scalar-color-2: ${toHex(colors.zinc[300])};
      --scalar-color-3: ${toHex(colors.zinc[500])};
      --scalar-color-accent: ${toHex(colors.primary[500])};
      --scalar-background-1: ${toHex(colors.zinc[950])};
      --scalar-background-2: ${toHex(colors.zinc[900])};
      --scalar-background-3: ${toHex(colors.zinc[800])};
      --scalar-border-color: ${toHex(colors.zinc[800])};
      --scalar-button-1: ${toHex(colors.primary[500])};
      --scalar-button-1-color: #ffffff;
      --scalar-font-family: 'Fira Sans', sans-serif;
      --scalar-font-family-mono: 'Fira Code', monospace;
    }
  `.trim(),
  
  /** Raw token mapping for programmatic use */
  tokens: {
    primary: toHex(colors.primary[500]),
    background: toHex(colors.zinc[950]),
    text: toHex(colors.zinc[100]),
  }
} as const;

export type ScalarTheme = typeof scalarTheme;
