import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Vitest UI Theme Configuration
 * Maps brand tokens to Vitest's dashboard CSS variables for the web UI.
 */
export const vitestTheme = {
  /** CSS Variable overrides for Vitest UI */
  css: `
    :root {
      --vitest-color-primary: ${toHex(colors.primary[500])};
      --vitest-color-bg: ${toHex(colors.zinc[950])};
      --vitest-color-bg-soft: ${toHex(colors.zinc[900])};
      --vitest-color-border: ${toHex(colors.zinc[800])};
      --vitest-color-text: ${toHex(colors.zinc[100])};
      --vitest-color-text-soft: ${toHex(colors.zinc[400])};
      --vitest-color-success: ${toHex(colors.success[500])};
      --vitest-color-danger: ${toHex(colors.destructive[500])};
      --vitest-color-warning: ${toHex(colors.amber[500])};
    }
  `.trim(),
  
  /** Raw theme mapping for programmatic use */
  tokens: {
    primary: toHex(colors.primary[500]),
    background: toHex(colors.zinc[950]),
  }
} as const;

export type VitestTheme = typeof vitestTheme;
