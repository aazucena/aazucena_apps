import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * GitHub Readme Stats Configuration
 * Maps brand tokens to HEX values (without '#') for github-readme-stats cards.
 */

const stripHash = (hex: string) => hex.replace('#', '');

export const githubStatsTheme = {
  title_color: stripHash(toHex(colors.primary[500])),
  text_color: stripHash(toHex(colors.zinc[100])),
  icon_color: stripHash(toHex(colors.secondary[500])),
  bg_color: stripHash(toHex(colors.zinc[950])),
  border_color: stripHash(toHex(colors.zinc[800])),
} as const;

/**
 * Generates a query string for GitHub Readme Stats.
 */
export function getGithubStatsQuery(): string {
  return Object.entries(githubStatsTheme)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export type GithubStatsTheme = typeof githubStatsTheme;
