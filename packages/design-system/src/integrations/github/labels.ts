import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * GitHub API Label Colors
 * Maps semantic issue/PR states to GitHub-compatible HEX colors (no '#' prefix).
 */

const stripHash = (hex: string) => hex.replace('#', '');

export const githubLabelColors = {
  /** High priority/Bug reports */
  bug: stripHash(toHex(colors.destructive[500])),

  /** New features / active development */
  feature: stripHash(toHex(colors.primary[500])),

  /** Improvements or refactoring */
  enhancement: stripHash(toHex(colors.secondary[500])),

  /** Documentation updates */
  documentation: stripHash(toHex(colors.zinc[400])),

  /** Maintenance / Infrastructure */
  maintenance: stripHash(toHex(colors.zinc[600])),

  /** Performance optimizations */
  performance: stripHash(toHex(colors.success[500])),
} as const;

export type GithubLabelColors = typeof githubLabelColors;
