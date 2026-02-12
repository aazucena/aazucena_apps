import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";
import { resolve } from "node:path";

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * Modern ESLint Flat Config for Astro + React projects.
 */
export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      "jsx-a11y": eslintPluginJsxA11y,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,

      // Temporary downgrades for Phase 4 Migration
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/ban-ts-comment": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "warn",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/heading-has-content": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "security/detect-object-injection": "off",
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          project,
        },
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // Ignore FlipWords useless escape error
    files: ['**/FlipWordsTagline.tsx'],
    rules: {
      'no-useless-escape': 'off',
    }
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.{js,jsx,astro,ts,tsx}'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.github/', 'types.generated.d.ts', '.astro/', '.turbo/'],
  },
];
