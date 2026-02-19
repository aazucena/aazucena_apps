import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * LinkedIn Branding Integration
 * Official brand colors and project mappings for social sharing widgets.
 */
export const linkedinBranding = {
  /** Official LinkedIn Brand Color */
  official: '#0A66C2',

  /** Project mapping for LinkedIn-specific UI elements */
  primary: toHex(colors.primary[500]),
  background: toHex(colors.zinc[950]),
  text: toHex(colors.zinc[100]),

  /** Styles for LinkedIn-style cards in the portfolio */
  card: {
    bg: toHex(colors.zinc[900]),
    border: toHex(colors.zinc[800]),
    accent: '#0A66C2',
  },
} as const;

export type LinkedinBranding = typeof linkedinBranding;
