import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Plausible Analytics Dashboard Branding
 * CSS variable overrides for branding a self-hosted or shared Plausible dashboard.
 */
export const plausibleTheme = {
  /** Main brand color for charts and buttons */
  primary: toHex(colors.primary[500]),
  
  /** Background of the dashboard */
  bg: toHex(colors.zinc[950]),
  
  /** Text color */
  text: toHex(colors.zinc[100]),
  
  /** Generated CSS string for injection */
  css: `
    :root {
      --plausible-primary: ${toHex(colors.primary[500])};
      --plausible-bg: ${toHex(colors.zinc[950])};
      --plausible-text: ${toHex(colors.zinc[100])};
      --plausible-muted: ${toHex(colors.zinc[500])};
    }
  `.trim(),
} as const;

export type PlausibleTheme = typeof plausibleTheme;
