import a11yConfig from '@aazucena/config/eslint/a11y.js';
import { createLibraryConfig } from '@aazucena/config/eslint/library.js';

/** @type {import("eslint").Linter.Config[]} */
export default [...createLibraryConfig({ isVisualization: true }), ...a11yConfig];
