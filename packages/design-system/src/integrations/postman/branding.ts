import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Postman Public API Documentation Branding
 * Maps brand tokens to Postman's public workspace and documentation settings.
 */
export const postmanBranding = {
  /** The main color used for headings and primary buttons */
  accentColor: toHex(colors.primary[500]),

  /** The theme for the documentation workspace ('dark' or 'light') */
  theme: 'dark' as const,

  /** Visual branding configuration */
  branding: {
    logo_background: toHex(colors.zinc[950]),
    sidebar_background: toHex(colors.zinc[900]),
    heading_color: toHex(colors.primary[500]),
    body_text_color: toHex(colors.zinc[100]),
    link_color: toHex(colors.primary[400]),
  },
} as const;

export type PostmanBranding = typeof postmanBranding;
