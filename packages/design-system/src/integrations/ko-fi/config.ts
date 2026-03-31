import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Ko-fi Widget and Page Configuration
 * Maps brand tokens to Ko-fi's widget, button, and profile settings.
 */
export const kofiConfig = {
  /** The primary color for the "Buy Me a Coffee" button. */
  button_color: toHex(colors.primary[500]),

  /** The text color on the button (usually white or dark depending on brand). */
  text_color: '#ffffff',

  /** The accent color for the Ko-fi profile page. */
  floating_chat_color: toHex(colors.secondary[500]),

  /** Widget type defaults */
  widget_type: 'floating_chat',
} as const;

export type KofiConfig = typeof kofiConfig;
