import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Astro Dev Toolbar Theme
 * Maps brand tokens to Astro's built-in development environment toolbar.
 */
export const astroDevTheme = {
  /** The primary brand color for the toolbar icon and highlights */
  accentColor: toHex(colors.primary[500]),

  /** The background color for the toolbar and its menus */
  backgroundColor: toHex(colors.zinc[950]),

  /** Text color for toolbar labels */
  textColor: toHex(colors.zinc[100]),

  /** CSS Variable overrides for Astro Dev Toolbar */
  cssVars: {
    '--astro-dev-accent': toHex(colors.primary[500]),
    '--astro-dev-bg': toHex(colors.zinc[950]),
    '--astro-dev-text': toHex(colors.zinc[100]),
    '--astro-dev-border': toHex(colors.zinc[800]),
  },
} as const;

export type AstroDevTheme = typeof astroDevTheme;
