// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig } from "eslint/config";
import eslintConfigAstro from "@repo/eslint-config/astro.js";


/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  {
    ...eslintConfigAstro,
    plugins: [...eslintConfigAstro.plugins, storybook],
    rules: {
      ...eslintConfigAstro.rules,
      ...storybook.configs.recommended.rules,
    },
  },
]);
