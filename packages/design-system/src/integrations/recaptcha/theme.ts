import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * reCAPTCHA v3 Configuration
 * Maps brand tokens to reCAPTCHA's UI theme and positioning.
 */
export const recaptchaTheme = {
  /** The theme for the reCAPTCHA badge ('dark' or 'light') */
  theme: 'dark' as const,

  /** Visual mapping for branding overrides if using a custom badge */
  colors: {
    accent: toHex(colors.primary[500]),
    background: toHex(colors.zinc[950]),
    text: toHex(colors.zinc[100]),
  },

  /** Badge visibility and positioning hints */
  badge: 'bottomright' as const,
} as const;

export type RecaptchaTheme = typeof recaptchaTheme;
