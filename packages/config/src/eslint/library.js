import baseConfig from "./base.js";

/**
 * Creates a modern ESLint Flat Config for pure TypeScript libraries.
 * @param {Object} options - Configuration options
 * @param {boolean} options.isVisualization - Whether to apply D3-friendly overrides
 */
export function createLibraryConfig(options = {}) {
  const { isVisualization = false } = options;

  return [
    ...baseConfig,
    {
      // Apply TS-specific project settings only to TS files
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        parserOptions: {
          project: true,
        },
      },
    },
    ...(isVisualization ? [
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-non-null-assertion': 'off',
        },
      }
    ] : []),
  ];
}

// Default export for backward compatibility
export default createLibraryConfig();
