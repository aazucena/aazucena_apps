import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Phaser.js Color Tokens
 * Maps brand tokens to HEX integers (0xRRGGBB) required by the Phaser rendering engine.
 */

const toPhaserColor = (hex: string): number => {
  const cleanHex = hex.replace('#', '');
  return parseInt(cleanHex, 16);
};

export const phaserColors = {
  primary: toPhaserColor(toHex(colors.primary[500])),
  secondary: toPhaserColor(toHex(colors.secondary[500])),
  background: toPhaserColor(toHex(colors.zinc[950])),
  surface: toPhaserColor(toHex(colors.zinc[900])),
  text: toPhaserColor(toHex(colors.zinc[100])),
  success: toPhaserColor(toHex(colors.success[500])),
  danger: toPhaserColor(toHex(colors.destructive[500])),
  warning: toPhaserColor(toHex(colors.amber[500])),

  /** Transparent versions for overlays */
  overlay: {
    dark: toPhaserColor(toHex(colors.zinc[950])),
    light: toPhaserColor(toHex(colors.zinc[100])),
  },
} as const;

export type PhaserColors = typeof phaserColors;
