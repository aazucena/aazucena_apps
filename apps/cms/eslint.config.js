
/** @type {import("eslint").Linter.Config[]} */
export default {
  root: true,
  extends: [
    '@strapi-community/eslint-config', // Or other base configs like 'eslint:recommended'
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
    'prettier', // Turns off all ESLint rules that might conflict with Prettier
  ],
  ignores: [
    "**/dist/**",
    "**/build/**",
    "**/.cache/**",
    "**/.tmp/**",
    "**/node_modules/**",
    "public/uploads/**",
    ".strapi/**"
  ],
}
