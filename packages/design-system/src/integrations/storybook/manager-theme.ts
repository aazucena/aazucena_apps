import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

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
  appBg: toHex(colors.ink[950]),
  appContentBg: toHex(colors.ink[900]),
  appHoverBg: toHex(colors.ink[900]),
  appPreviewBg: toHex(colors.ink[950]),
  appBorderColor: toHex(colors.ink[800]),
  appBorderRadius: 4,

  // Typography
  fontBase: '"Fira Sans", sans-serif',
  fontCode: '"Fira Code", monospace',

  // Text Colors
  textColor: toHex(colors.ink[200]),
  textInverseColor: toHex(colors.ink[900]),
  textMutedColor: toHex(colors.ink[500]),

  // Toolbar Colors
  barTextColor: toHex(colors.ink[500]),
  barSelectedColor: toHex(colors.primary[500]),
  barHoverColor: toHex(colors.primary[500]),
  barBg: toHex(colors.ink[950]),

  // Form Colors
  inputBg: toHex(colors.ink[900]),
  inputBorder: toHex(colors.ink[800]),
  inputTextColor: toHex(colors.ink[200]),
  inputBorderRadius: 4,

  // Specialized Controls
  booleanBg: toHex(colors.ink[800]),
  booleanSelectedBg: toHex(colors.primary[500]),
  buttonBg: toHex(colors.ink[800]),
  buttonBorder: toHex(colors.ink[700]),

  // Primary Color
  colorPrimary: toHex(colors.signal[500]),
  colorSecondary: toHex(colors.signal[500]),
} as const;

export type ManagerTheme = typeof managerTheme;
