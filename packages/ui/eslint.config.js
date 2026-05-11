import eslintConfigAstro from '@aazucena/config/eslint/astro.js';
import storybook from 'eslint-plugin-storybook';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...eslintConfigAstro,
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)', '**/*.story.@(ts|tsx|js|jsx|mjs|cjs)'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },
  {
    // react-hooks v7 React Compiler rules are not applicable to a component library
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
    },
  },
];
