import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';
import tailwindcssAnimate from 'tailwindcss-animate';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
  spacing,
  shadows,
  breakpoints,
  transitions,
  layout,
} from './tokens/index.js';

const tailwindPreset: Config = {
  content: [],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Map shadcn semantic tokens to our OKLCH system
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'surface-base': 'var(--base)',
        elevated: 'var(--elevated)',
        floating: 'var(--floating)',
        primary: {
          ...colors.primary,
          DEFAULT: colors.primary[500],
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          ...colors.secondary,
          DEFAULT: colors.secondary[500],
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          ...colors.destructive,
          DEFAULT: colors.destructive[500],
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          ...colors.success,
          DEFAULT: colors.success[500],
          foreground: 'var(--success-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      fontFamily: {
        ...fontFamilies,
      },
      fontSize: {
        ...fontSizes,
      },
      fontWeight: {
        ...fontWeights,
      },
      letterSpacing: {
        ...letterSpacing,
      },
      lineHeight: {
        ...lineHeights,
      },
      spacing: {
        ...spacing,
      },
      gap: {
        ...layout.section.gap,
      },
      maxWidth: {
        container: layout.container.max,
      },
      gridTemplateColumns: {
        desktop: 'repeat(12, 1fr)',
        mobile: 'repeat(4, 1fr)',
      },
      boxShadow: {
        ...shadows,
      },
      screens: {
        ...breakpoints,
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'hue-shift': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        'cyber-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.95)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-from-right 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'hue-shift': 'hue-shift 5s linear infinite',
        'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
      },
      transitionDuration: {
        ...transitions.duration,
      },
      transitionTimingFunction: {
        ...transitions.timing,
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindcssAnimate,
    ({ addUtilities }: { addUtilities: (...args: any[]) => any }) => {
      addUtilities({
        '.glass': {
          '@apply bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl dark:bg-black/40 dark:border-white/10':
            {},
        },
        '.glass-m': {
          '@apply bg-white/20 backdrop-blur-md border border-white/30 dark:bg-black/20 dark:border-white/10':
            {},
        },
      });
    },
    ({ addVariant }: { addVariant: (...args: any[]) => any }) => {
      addVariant('data-open', ['&[data-state="open"]', '&[data-state="opened"]']);
      addVariant('data-closed', ['&[data-state="closed"]', '&[data-state="closed"]']);
      addVariant('data-active', ['&[data-state="active"]', '&[data-active="true"]']);
      addVariant('data-checked', ['&[data-state="checked"]', '&[data-checked="true"]']);
      addVariant('data-unchecked', ['&[data-state="unchecked"]', '&[data-unchecked="true"]']);
      addVariant('data-visible', ['&[data-state="visible"]']);
      addVariant('data-hidden', ['&[data-state="hidden"]']);
    },
  ],
} satisfies Config;

export default tailwindPreset;
