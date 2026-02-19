import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';
import { managerTheme } from './manager-theme.js'; // Import manager theme

/**
 * Storybook Docs (Preview) Theme
 * Maps brand tokens to Storybook's Docs UI (MDX pages, code blocks, typography).
 * Compatible with Storybook's `create()` function from `@storybook/theming`.
 */
export const previewTheme = {
  // Inherit base, brand identity, and fonts from manager theme
  base: 'light' as const, // Explicitly set to light theme
  brandTitle: managerTheme.brandTitle,
  brandUrl: managerTheme.brandUrl,
  brandTarget: managerTheme.brandTarget,

  fontBase: managerTheme.fontBase,
  fontCode: managerTheme.fontCode,

  // UI Colors (Docs are simpler, mostly content-focused) - Adjusted for light theme
  appBg: toHex(colors.zinc[50]), // Light background for docs page
  appContentBg: toHex(colors.zinc[100]), // Slightly darker for content panels
  appBorderColor: toHex(colors.zinc[200]),
  appBorderRadius: 4,

  // Text Colors (for rendered MDX content) - Adjusted for light theme
  textColor: toHex(colors.zinc[900]),
  textInverseColor: toHex(colors.zinc[100]), // Inverted for contrast if needed
  textMutedColor: toHex(colors.zinc[500]),

  // Code Block Colors (syntax highlighting, inline code) - Adjusted for light theme
  codeBg: toHex(colors.zinc[100]),
  codeBorder: toHex(colors.zinc[200]),

  // Primary & Secondary for general highlighting (if applicable in docs) - Keep as is, they are accents
  colorPrimary: toHex(colors.primary[500]),
  colorSecondary: toHex(colors.secondary[500]),
} as const;

export type PreviewTheme = typeof previewTheme;
