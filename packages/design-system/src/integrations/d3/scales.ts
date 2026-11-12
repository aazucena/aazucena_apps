import { chartTheme } from '../../tokens/chart';

/**
 * D3.js color scales, backed by the Avra chart tokens.
 * @deprecated Use `chartTheme` from `@aazucena/design-system`; removed in 0.3.0.
 */
export const d3Scales = {
  /** Categorical scale for distinct series. */
  categorical: chartTheme.series,
  /** Sequential scale for heatmaps or intensity. */
  sequential: chartTheme.seq,
  /** Diverging scale (cyan ↔ neutral ↔ coral). */
  diverging: chartTheme.div,
} as const;

export type D3Scales = typeof d3Scales;
