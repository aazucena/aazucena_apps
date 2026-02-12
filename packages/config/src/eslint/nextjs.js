import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";
import globals from "globals";

/**
 * Shared Next.js ESLint Configuration Factory
 * Applies standard Next.js rules plus our monorepo-specific pragmatic overrides.
 */
export function createNextConfig({ project } = {}) {
  return tseslint.config(
    js.configs.recommended,
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

        // Pragmatic overrides for Phase 4 Migration
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/heading-has-content": "off",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "security/detect-object-injection": "off",
      },
    },
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          project: project || true,
        },
      },
    },
    {
      ignores: [
        ".next/**",
        "out/**",
        "build/**",
        "dist/**",
        "node_modules/**",
        "next-env.d.ts",
      ],
    },
  );
}

export default createNextConfig();
