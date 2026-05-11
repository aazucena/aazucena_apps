import { createNextConfig } from '@aazucena/config/eslint/nextjs.js';

export default [
  { ignores: ['eslint.config.mjs', 'postcss.config.mjs', 'scripts/**'] },
  ...createNextConfig(),
  {
    rules: {
      // App-specific overrides
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
