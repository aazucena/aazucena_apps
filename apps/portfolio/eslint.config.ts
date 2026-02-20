import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  // Astro configuration
  ...(eslintPluginAstro.configs.recommended as Linter.Config[]),

  // Custom rules for TS and Astro files
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint as any,
    },
    languageOptions: {
      parser: tsParser as any,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...(tseslint.configs.recommended?.rules || {}),
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
    },
  },
  {
    files: ["**/*.astro"],
    plugins: {
      "@typescript-eslint": tseslint as any,
    },
    languageOptions: {
      parser: astroParser as any,
      parserOptions: {
        parser: tsParser as any,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];

export default config;
