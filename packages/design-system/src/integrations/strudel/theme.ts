import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Strudel.cc REPL Theme
 * Maps brand tokens to Strudel's live coding environment and visualizer.
 */
export const strudelTheme = {
  /** The main background of the Strudel REPL */
  background: toHex(colors.zinc[950]),

  /** The default color for the code editor text */
  foreground: toHex(colors.zinc[100]),

  /** Primary accent for UI elements and active visualizers */
  accent: toHex(colors.primary[500]),

  /** Selection and highlight background */
  selection: toHex(colors.primary[900]),

  /** Syntax highlighting for live coding patterns */
  syntax: {
    numbers: toHex(colors.amber[400]),
    strings: toHex(colors.success[400]),
    functions: toHex(colors.primary[300]),
    operators: toHex(colors.secondary[400]),
    comments: toHex(colors.zinc[500]),
  },

  /** CSS Variables for Strudel DOM components */
  cssVars: {
    '--strudel-bg': toHex(colors.zinc[950]),
    '--strudel-text': toHex(colors.zinc[100]),
    '--strudel-primary': toHex(colors.primary[500]),
    '--strudel-secondary': toHex(colors.secondary[500]),
  },
} as const;

export type StrudelTheme = typeof strudelTheme;
