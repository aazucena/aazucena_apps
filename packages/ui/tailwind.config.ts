import tailwindConfig from "@repo/shared/tailwind/astro.ts";
/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  darkMode: ["class"],
};
