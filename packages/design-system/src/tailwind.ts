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
  darkMode: 'class',
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
        base: 'var(--base)',
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
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-from-right 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'hue-shift': 'hue-shift 5s linear infinite',
      },
      transitionDuration: {
        ...transitions.duration,
      },
      transitionTimingFunction: {
        ...transitions.timing,
      },
    },
  },
  plugins: [typographyPlugin, tailwindcssAnimate],
} as unknown as Config;

export default tailwindPreset;
