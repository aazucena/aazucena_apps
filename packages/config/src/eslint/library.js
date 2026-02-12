import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import { resolve } from "node:path";

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * Creates a modern ESLint Flat Config for pure TypeScript libraries.
 * @param {Object} options - Configuration options
 * @param {boolean} options.isVisualization - Whether to apply D3-friendly overrides
 */
export function createLibraryConfig(options = {}) {
  const { isVisualization = false } = options;

  return [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    security.configs.recommended,
    {
      // Apply TS-specific project settings only to TS files in src or tests
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        parserOptions: {
          project,
        },
      },
    },
    {
      rules: {
        // Default rules for all libraries
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-require-imports": "warn",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "prefer-const": "warn",
        "security/detect-object-injection": "off", // Too noisy for D3/ThreeJS mapping
      },
    },
    ...(isVisualization ? [
      {
        // Data-heavy packages require more flexibility for D3/Zod logic
        files: [
          '**/*.ts', 
          '**/*.tsx'
        ],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-non-null-assertion': 'off',
        },
      }
    ] : []),
    {
      ignores: ['dist/', 'node_modules/', '.turbo/', '.astro/'],
    },
  ];
}

// Default export for backward compatibility
export default createLibraryConfig();