import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Stripe Branding Configuration
 * Maps brand tokens to Stripe's Dashboard, Checkout, and Customer Portal settings.
 */
export const stripeBranding = {
  /** The brand's primary color used for buttons and links in Checkout. */
  primary_color: toHex(colors.primary[500]),

  /** The background color for buttons. */
  button_color: toHex(colors.zinc[950]),

  /** The accent color used for secondary actions. */
  secondary_color: toHex(colors.secondary[500]),

  /** Font family preferred for Stripe UI components. */
  font_family: 'Fira Sans',
} as const;

export type StripeBranding = typeof stripeBranding;
