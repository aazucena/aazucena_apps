import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * TanStack Query Devtools Theme
 * Maps brand tokens to the TanStack Query (React Query) Devtools component.
 */
export const tanstackQueryTheme = {
  /** The theme for the devtools ('dark' or 'light') */
  mode: 'dark' as const,
  
  /** Custom colors for the devtools UI */
  colors: {
    background: toHex(colors.zinc[950]),
    text: toHex(colors.zinc[100]),
    primary: toHex(colors.primary[500]),
    secondary: toHex(colors.secondary[500]),
    border: toHex(colors.zinc[800]),
  },
  
  /** Panel positioning and visibility defaults */
  position: 'bottom' as const,
  initialIsOpen: false,
} as const;

export type TanStackQueryTheme = typeof tanstackQueryTheme;
