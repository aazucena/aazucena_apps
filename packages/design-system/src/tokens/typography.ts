/**
 * Typography Tokens
 * Based on the Aldrin Azucena Portfolio design system.
 */

export const fontFamilies = {
  sans: [
    'Fira Sans',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ],
  mono: [
    'Fira Code',
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
  serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
} as const;

export const fontSizes = {
  // Headings
  h1: ['30px', { lineHeight: '1.2', fontWeight: '700' }],
  h2: ['24px', { lineHeight: '1.3', fontWeight: '700' }],
  h3: ['20px', { lineHeight: '1.4', fontWeight: '700' }],
  h4: ['18px', { lineHeight: '1.4', fontWeight: '700' }],
  h5: ['16px', { lineHeight: '1.5', fontWeight: '700' }],
  h6: ['14px', { lineHeight: '1.5', fontWeight: '700' }],

  // Body
  body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
  caption: ['12px', { lineHeight: '1.4', fontWeight: '400' }],

  // Base scales (Standard Tailwind-like names for consistency)
  xs: ['10px', { lineHeight: '1rem' }],
  sm: ['12px', { lineHeight: '1.25rem' }],
  base: ['14px', { lineHeight: '1.5rem' }],
  lg: ['16px', { lineHeight: '1.75rem' }],
  xl: ['18px', { lineHeight: '1.75rem' }],
  '2xl': ['20px', { lineHeight: '2rem' }],
  '3xl': ['24px', { lineHeight: '2.25rem' }],
  '4xl': ['30px', { lineHeight: '2.5rem' }],
  '5xl': ['36px', { lineHeight: '1' }],
  '6xl': ['48px', { lineHeight: '1' }],
} as const;

export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '800',
  extraBold: '900',
} as const;

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;
