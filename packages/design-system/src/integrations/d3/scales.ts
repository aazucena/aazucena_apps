import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * D3.js Color Scales
 * Provides categorical and sequential color arrays for complex data visualizations
 * in the AZUCENA_LYTICS telemetry dashboards.
 */

export const d3Scales = {
  /** Categorical scale for distinct data types (e.g., event categories) */
  categorical: [
    toHex(colors.primary[500]),
    toHex(colors.secondary[500]),
    toHex(colors.success[500]),
    toHex(colors.amber[500]),
    toHex(colors.destructive[500]),
    toHex(colors.violet[500]),
    toHex(colors.indigo[500]),
    toHex(colors.rose[500]),
  ],

  /** Sequential scale for heatmaps or intensity (Zinc based) */
  sequentialZinc: [
    toHex(colors.zinc[950]),
    toHex(colors.zinc[800]),
    toHex(colors.zinc[600]),
    toHex(colors.zinc[400]),
    toHex(colors.zinc[200]),
    toHex(colors.zinc[50]),
  ],

  /** Sequential scale for brand intensity (Cyan based) */
  sequentialPrimary: [
    toHex(colors.primary[950]),
    toHex(colors.primary[800]),
    toHex(colors.primary[600]),
    toHex(colors.primary[400]),
    toHex(colors.primary[200]),
    toHex(colors.primary[50]),
  ],

  /** Diverging scale (Success -> Zinc -> Danger) */
  diverging: [
    toHex(colors.success[600]),
    toHex(colors.success[200]),
    toHex(colors.zinc[200]),
    toHex(colors.destructive[200]),
    toHex(colors.destructive[600]),
  ],
} as const;

export type D3Scales = typeof d3Scales;
