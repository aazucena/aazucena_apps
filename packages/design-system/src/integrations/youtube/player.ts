import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * YouTube Player Configuration
 * Default branding and theme variables for embedded YouTube players.
 */
export const youtubeTheme = {
  /** Forced theme for the player ('dark' or 'light') */
  theme: 'dark' as const,
  
  /** Preferred color for the video progress bar ('red' or 'white') */
  color: 'white' as const,
  
  /** Mapping brand tokens for custom UI wrappers around the player */
  ui: {
    border: toHex(colors.primary[500]),
    overlay: toHex(colors.zinc[950]),
    text: toHex(colors.zinc[100]),
  },
  
  /** Default player parameters for the YouTube Iframe API */
  playerVars: {
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    theme: 'dark',
    color: 'white',
  }
} as const;

export type YoutubeTheme = typeof youtubeTheme;
