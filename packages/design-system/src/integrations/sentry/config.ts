import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Sentry Project Branding Configuration
 * Maps brand tokens to Sentry's organization and project UI settings.
 */
export const sentryBranding = {
  /** The main accent color for the Sentry dashboard. */
  accentColor: toHex(colors.primary[500]),
  
  /** The color used for branding symbols and icons. */
  symbolColor: toHex(colors.secondary[500]),
  
  /** Background color for error reports and alerts. */
  errorColor: toHex(colors.destructive[500]),
} as const;

export type SentryBranding = typeof sentryBranding;
