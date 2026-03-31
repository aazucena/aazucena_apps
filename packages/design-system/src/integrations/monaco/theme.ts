import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Monaco Editor Theme Definition
 * Maps design system tokens to Monaco's syntax highlighting and UI scopes.
 */
export const monacoTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'keyword', foreground: toHex(colors.primary[400]) },
    { token: 'comment', foreground: toHex(colors.zinc[500]), fontStyle: 'italic' },
    { token: 'string', foreground: toHex(colors.success[400]) },
    { token: 'variable', foreground: toHex(colors.zinc[100]) },
    { token: 'type', foreground: toHex(colors.secondary[400]) },
    { token: 'function', foreground: toHex(colors.primary[300]) },
    { token: 'number', foreground: toHex(colors.amber[400]) },
  ],
  colors: {
    'editor.background': toHex(colors.zinc[950]),
    'editor.foreground': toHex(colors.zinc[100]),
    'editorCursor.foreground': toHex(colors.primary[500]),
    'editor.lineHighlightBackground': toHex(colors.zinc[900]),
    'editorLineNumber.foreground': toHex(colors.zinc[600]),
    'editor.selectionBackground': toHex(colors.primary[900]),
    'editorIndentGuide.background': toHex(colors.zinc[800]),
    'editorSuggestWidget.background': toHex(colors.zinc[900]),
  },
};

export type MonacoTheme = typeof monacoTheme;
