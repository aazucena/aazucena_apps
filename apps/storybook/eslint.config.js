import reactSharedConfig from "@aazucena/config/eslint/react.js";
import storybook from "eslint-plugin-storybook";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactSharedConfig,
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts", ".storybook/**/*.tsx", ".storybook/**/*.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "import/no-anonymous-default-export": "off",
      "storybook/no-renderer-packages": "off",
      "jsx-a11y/aria-role": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
  {
    ignores: ["storybook-static/", "node_modules/", ".turbo/", "src/test.tsx"],
  },
];
