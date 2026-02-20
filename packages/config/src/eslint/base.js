import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import globals from "globals";

/**
 * Base ESLint Flat Config for the AAZUCENA Monorepo.
 * This file serves as the single source of truth for global linting standards.
 */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // TypeScript Standard Overrides
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-require-imports": "warn",
      
      // General Code Quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      
      // Security
      "security/detect-object-injection": "off", // Performance mapping often uses indices
    },
  },
  {
    ignores: [
      "dist/",
      "node_modules/",
      ".turbo/",
      ".astro/",
      ".next/",
      "storybook-static/",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "*.d.ts",
      "scripts/",
    ],
  },
];

export default baseConfig;
