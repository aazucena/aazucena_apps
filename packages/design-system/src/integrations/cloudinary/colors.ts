import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Cloudinary URL-Safe Color Tokens
 * Formats HEX codes specifically for use in Cloudinary's dynamic transformation URLs.
 * Note: Cloudinary URLs require HEX codes without the '#' prefix (e.g., 'rgb:00a3e0').
 */

const stripHash = (hex: string) => hex.replace('#', '');

export const cloudinaryColors = {
  primary: stripHash(toHex(colors.primary[500])),
  secondary: stripHash(toHex(colors.secondary[500])),
  zinc: stripHash(toHex(colors.zinc[950])),
  white: 'ffffff',
  destructive: stripHash(toHex(colors.destructive[500])),
} as const;

/**
 * Generates a Cloudinary-compatible color string.
 * @example getCloudinaryColor('primary') => 'rgb:00a3e0'
 */
export function getCloudinaryColor(name: keyof typeof cloudinaryColors): string {
  return `rgb:${cloudinaryColors[name]}`;
}

export type CloudinaryColors = typeof cloudinaryColors;
