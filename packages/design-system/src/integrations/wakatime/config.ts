import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * WakaTime Widget & Badge Configuration
 * Maps brand tokens to WakaTime's public chart and badge styles.
 */

const stripHash = (hex: string) => hex.replace('#', '');

export const wakatimeConfig = {
  /** The primary color for graph bars and badge icons. */
  color: stripHash(toHex(colors.primary[500])),
  
  /** The background color for the badge/chart. */
  background: stripHash(toHex(colors.zinc[950])),
  
  /** Text color for labels. */
  text: stripHash(toHex(colors.zinc[100])),
} as const;

export type WakaTimeConfig = typeof wakatimeConfig;
