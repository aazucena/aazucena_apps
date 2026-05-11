import { colors } from '../../tokens/colors';
import { toHex } from '../../utils/color-converter';

/**
 * Weather Visuals Integration
 * Maps weather conditions to design system tokens for icon and UI coloring.
 */
export const weatherTheme = {
  /** Clear/Sunny weather */
  clear: toHex(colors.amber[400]),

  /** Rainy/Cloudy weather */
  clouds: toHex(colors.zinc[400]),
  rain: toHex(colors.primary[500]),

  /** Severe/Stormy weather */
  storm: toHex(colors.secondary[500]),

  /** Snowy/Cold weather */
  snow: toHex(colors.sky?.[400] || colors.blue[400]),

  /** Atmospheric backgrounds */
  day: toHex(colors.sky?.[500] || colors.blue[500]),
  night: toHex(colors.zinc[950]),
} as const;

export type WeatherTheme = typeof weatherTheme;
