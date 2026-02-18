import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * CLI Brand Colors
 * Maps brand tokens to HEX values suitable for terminal coloring libraries (picocolors, chalk).
 */
export const cliColors = {
  primary: toHex(colors.primary[500]),
  secondary: toHex(colors.secondary[500]),
  success: toHex(colors.success[500]),
  warning: toHex(colors.amber[500]),
  error: toHex(colors.destructive[500]),
  muted: toHex(colors.zinc[500]),
  highlight: toHex(colors.zinc[100]),
  background: toHex(colors.zinc[950]),
} as const;

export type CliColors = typeof cliColors;
