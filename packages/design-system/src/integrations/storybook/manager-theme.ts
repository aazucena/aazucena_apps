import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Storybook Manager Theme
 * Maps brand tokens to Storybook's internal UI (Sidebar, Toolbar, Panels).
 * Compatible with Storybook's `create()` function from `@storybook/theming`.
 */
export const managerTheme = {
  base: 'dark' as const,

  // Brand Identity
  brandTitle: 'Avra Design System',
  brandUrl: 'https://avra.aazucena.com',
  brandTarget: '_self',

  // UI Colors
  appBg: toHex(colors.zinc[950]),
  appContentBg: toHex(colors.zinc[900]),
  appHoverBg: toHex(colors.zinc[900]),
  appPreviewBg: toHex(colors.zinc[950]),
  appBorderColor: toHex(colors.zinc[800]),
  appBorderRadius: 4,

  // Typography
  fontBase: '"Fira Sans", sans-serif',
  fontCode: '"Fira Code", monospace',

  // Text Colors
  textColor: toHex(colors.zinc[100]),
  textInverseColor: toHex(colors.zinc[900]),
  textMutedColor: toHex(colors.zinc[400]),

  // Toolbar Colors
  barTextColor: toHex(colors.zinc[400]),
  barSelectedColor: toHex(colors.primary[500]),
  barHoverColor: toHex(colors.primary[500]),
  barBg: toHex(colors.zinc[950]),

  // Form Colors
  inputBg: toHex(colors.zinc[900]),
  inputBorder: toHex(colors.zinc[800]),
  inputTextColor: toHex(colors.zinc[100]),
  inputBorderRadius: 4,

  // Specialized Controls
  booleanBg: toHex(colors.zinc[800]),
  booleanSelectedBg: toHex(colors.primary[500]),
  buttonBg: toHex(colors.zinc[800]),
  buttonBorder: toHex(colors.zinc[700]),

  // Primary Color
  colorPrimary: toHex(colors.primary[500]),
  colorSecondary: toHex(colors.secondary[500]),
} as const;

export type ManagerTheme = typeof managerTheme;
