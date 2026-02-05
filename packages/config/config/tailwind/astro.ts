import type { Config } from 'tailwindcss';
import baseConfig from "./base";

const config: Config = {
  ...baseConfig,
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
};

export default config;
