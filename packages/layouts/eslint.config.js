import a11yConfig from '@aazucena/config/eslint/a11y.js';
import libraryConfig from '@aazucena/config/eslint/library.js';

/** @type {import("eslint").Linter.Config[]} */
export default [...libraryConfig, ...a11yConfig];
