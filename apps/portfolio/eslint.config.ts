import aazucenaAstroConfig from "@aazucena/config/eslint/astro.js";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  ...(aazucenaAstroConfig as Linter.Config[]),

  // Portfolio-specific overrides
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.astro"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];

export default config;
