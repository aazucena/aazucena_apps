import type { Config } from 'tailwindcss';
import { tailwindPreset as tailwindConfig } from '@aazucena/design-system';

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  darkMode: tailwindConfig.darkMode,
  content: ['./stories/**/*.{js,jsx,ts,tsx,mdx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
} satisfies Config;
