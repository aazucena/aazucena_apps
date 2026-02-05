import type { Config } from 'tailwindcss';
import baseConfig from "./base";

const config: Config = {
  ...baseConfig,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};

export default config;
