import { createLibraryConfig } from "@aazucena/config/eslint/library.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...createLibraryConfig({ isVisualization: true }),
];