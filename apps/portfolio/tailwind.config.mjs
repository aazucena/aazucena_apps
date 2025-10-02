import defaultTheme from 'tailwindcss/defaultTheme';
import typographyPlugin from '@tailwindcss/typography';
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        default: 'var(--color-text-default)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
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
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
}
