import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: [
      '.coverage',
      '.vscode',
      '.idea',
      '**/dist/**',
      '**/build/**',
      '**/.cache/**',
      '**/.tmp/**',
      '**/node_modules/**',
      '**/clickhouse/**',
      'public/uploads/**',
      '.strapi/**',
      'types/generated/**',
      '**/content-types/**/schema.json',
      '**/components/**/*.json',
      'src/admin/build/',
      'src/admin/.cache/',
      'src/admin/.tmp/',
    ],
  },
];
