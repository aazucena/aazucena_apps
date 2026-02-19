import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Mapbox GL JS Layer Styles
 * Maps brand tokens to Mapbox's proprietary style JSON schema.
 */
export const mapboxTheme = {
  /** The base land color (background) */
  land: toHex(colors.zinc[950]),

  /** Water bodies and rivers */
  water: toHex(colors.primary[900]),

  /** Roads and transport networks */
  roads: toHex(colors.zinc[800]),

  /** Building footprints */
  buildings: toHex(colors.zinc[900]),

  /** Primary accent for markers or paths */
  accent: toHex(colors.primary[500]),

  /** Text labels on the map */
  labels: toHex(colors.zinc[400]),
} as const;

export type MapboxTheme = typeof mapboxTheme;
