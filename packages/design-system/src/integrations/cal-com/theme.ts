import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Cal.com Embed Theme Configuration
 * Maps brand tokens to Cal.com's CSS variables for the embedded scheduling widget.
 */
export const calComTheme = {
  /** Main brand color (buttons, primary accents) */
  brandColor: toHex(colors.primary[500]),

  /** Background color of the widget */
  bgColor: toHex(colors.zinc[950]),

  /** Primary text color */
  textColor: toHex(colors.zinc[100]),

  /** Subtle text for captions/hints */
  subtleColor: toHex(colors.zinc[400]),

  /** Border colors for inputs and cards */
  borderColor: toHex(colors.zinc[800]),

  /** Mapping to Cal.com specific CSS variables if using custom CSS injection */
  cssVars: {
    '--cal-brand': toHex(colors.primary[500]),
    '--cal-brand-emphasis': toHex(colors.primary[600]),
    '--cal-bg': toHex(colors.zinc[950]),
    '--cal-text': toHex(colors.zinc[100]),
    '--cal-text-subtle': toHex(colors.zinc[400]),
    '--cal-border-subtle': toHex(colors.zinc[800]),
  },
} as const;

export type CalComTheme = typeof calComTheme;
