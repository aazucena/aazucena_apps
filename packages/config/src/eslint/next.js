import baseConfig from "./base.js";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

/**
 * Shared Next.js ESLint Configuration Factory.
 * Applies standard Next.js rules plus monorepo-specific pragmatic overrides.
 */
export function createNextConfig({ project } = {}) {
  return [
    ...baseConfig,
    {
      plugins: {
        "react-hooks": eslintPluginReactHooks,
        "jsx-a11y": eslintPluginJsxA11y,
      },
      rules: {
        ...eslintPluginReactHooks.configs.recommended.rules,
        ...eslintPluginJsxA11y.configs.recommended.rules,

        // Pragmatic overrides
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/heading-has-content": "off",
      },
    },
    {
      languageOptions: {
        parserOptions: {
          project: project || true,
        },
      },
    },
  ];
}

export default createNextConfig();
