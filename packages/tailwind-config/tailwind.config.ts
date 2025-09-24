import defaultTheme from 'tailwindcss/defaultTheme';
import typographyPlugin from '@tailwindcss/typography';
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aa-color-primary)',
        secondary: 'var(--aa-color-secondary)',
        accent: 'var(--aa-color-accent)',
        default: 'var(--aa-color-text-default)',
        muted: 'var(--aa-color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--aa-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aa-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aa-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindcssAnimate,
  ],
  darkMode: 'class',
}
