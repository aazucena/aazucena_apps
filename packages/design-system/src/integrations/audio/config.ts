import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Audio Platform Embed Utilities
 * Formats brand tokens for use in Spotify and SoundCloud iframe parameters.
 */

const stripHash = (hex: string) => hex.replace('#', '');

export const audioEmbeds = {
  /**
   * Formatted color for Spotify embeds (requires HEX with # for some, or just HEX).
   * Note: Spotify's internal API for widgets is limited but some embeds support a 'color' param.
   */
  spotify: toHex(colors.primary[500]),

  /**
   * Formatted color for SoundCloud embeds (requires HEX without '#').
   */
  soundcloud: stripHash(toHex(colors.primary[500])),
} as const;

/**
 * Helper to generate a SoundCloud embed URL with brand colors.
 */
export function getSoundCloudUrl(trackId: string): string {
  const color = stripHash(toHex(colors.primary[500]));
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23${color}`;
}

export type AudioEmbeds = typeof audioEmbeds;
