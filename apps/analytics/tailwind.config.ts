import type { Config } from 'tailwindcss';
import typographyPlugin from '@tailwindcss/typography';
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Border and background colors
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Primary colors with full range (Cyan Blue #32A0C5)
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },

        // Secondary colors with full range (Coral Orange #FF7B54)
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          950: 'var(--secondary-950)',
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },

        // Neutral colors (Grays)
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },

        // Destructive/Error colors (Red)
        destructive: {
          50: 'var(--destructive-50)',
          100: 'var(--destructive-100)',
          200: 'var(--destructive-200)',
          300: 'var(--destructive-300)',
          400: 'var(--destructive-400)',
          500: 'var(--destructive-500)',
          600: 'var(--destructive-600)',
          700: 'var(--destructive-700)',
          800: 'var(--destructive-800)',
          900: 'var(--destructive-900)',
          950: 'var(--destructive-950)',
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },

        // Success colors (Green)
        success: {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
          950: 'var(--success-950)',
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },

        // Muted colors
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },

        // Accent colors
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        // Popover colors
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },

        // Card colors
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // Chart colors
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },

        // Sidebar colors
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },

      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },

      fontFamily: {
        sans: ['Fira Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Typography scale from design system
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'h5': ['16px', { lineHeight: '1.5', fontWeight: '700' }],
        'h6': ['14px', { lineHeight: '1.5', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },

      spacing: {
        // 4px baseline grid
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },

      gridTemplateColumns: {
        // Custom grid layouts
        'desktop': 'repeat(12, 1fr)',
        'mobile': 'repeat(4, 1fr)',
      },

      gap: {
        'desktop': '24px',
        'mobile': '16px',
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
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
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

      scale: {
        '102': '1.02',
      },

      transitionDuration: {
        '200': '200ms',
      },

      minHeight: {
        'touch-target': '44px',
      },

      minWidth: {
        'touch-target': '44px',
      },

      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindcssAnimate,
  ]
}

export default config;
