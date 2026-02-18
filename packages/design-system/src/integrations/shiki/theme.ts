import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Shiki Code Highlighting Theme
 * A VS Code-compatible theme object for static syntax highlighting in Astro/Markdown.
 */
export const shikiTheme = {
  name: 'aazucena-dark',
  type: 'dark',
  colors: {
    'editor.background': toHex(colors.zinc[950]),
    'editor.foreground': toHex(colors.zinc[100]),
    'terminal.background': toHex(colors.zinc[950]),
    'terminal.foreground': toHex(colors.zinc[100]),
  },
  tokenColors: [
    {
      scope: ['keyword', 'storage.type', 'storage.modifier'],
      settings: { foreground: toHex(colors.primary[400]) },
    },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: toHex(colors.zinc[500]), fontStyle: 'italic' },
    },
    {
      scope: ['string', 'punctuation.definition.string'],
      settings: { foreground: toHex(colors.success[400]) },
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: toHex(colors.primary[300]) },
    },
    {
      scope: ['variable', 'string.unquoted'],
      settings: { foreground: toHex(colors.zinc[100]) },
    },
    {
      scope: ['constant.numeric'],
      settings: { foreground: toHex(colors.amber[400]) },
    },
    {
      scope: ['entity.name.type', 'support.type'],
      settings: { foreground: toHex(colors.secondary[400]) },
    },
  ],
};

export type ShikiTheme = typeof shikiTheme;
