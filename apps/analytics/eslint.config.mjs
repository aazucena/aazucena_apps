import { createNextConfig } from '@aazucena/config/eslint/nextjs.js';

export default [
  { ignores: ['eslint.config.mjs', 'postcss.config.mjs', 'scripts/**'] },
  ...createNextConfig(),
  {
    rules: {
      // App-specific overrides
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      // eslint-config-next 16.4 promotes this to error; 5 existing sites are
      // tracked in docs/next-release-backlog.md until they're refactored
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
