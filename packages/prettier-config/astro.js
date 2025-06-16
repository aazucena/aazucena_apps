import prettierPluginAstro from 'prettier-plugin-astro';

/** @type {import('prettier').Config} */
export default {
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,

  plugins: [prettierPluginAstro],

  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};