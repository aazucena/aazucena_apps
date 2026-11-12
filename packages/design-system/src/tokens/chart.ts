import { fontFamilies } from './typography';

/**
 * Chart roles as CSS `var()` references. D3 accepts these as `fill`/`stroke` values, so
 * charts follow the applied vibe and light/dark mode without reading computed styles.
 * Coral (`--alert`) is never a series color; it marks anomalies only.
 */
export const chartTheme = {
  /** Categorical series, in the locked order: cyan → olive → violet → rose. */
  series: ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'],
  /** Sequential ramp, low → high (heatmaps, intensity). */
  seq: [
    'var(--chart-seq-1)',
    'var(--chart-seq-2)',
    'var(--chart-seq-3)',
    'var(--chart-seq-4)',
    'var(--chart-seq-5)',
  ],
  /** Diverging ramp, low → mid → high (cyan ↔ neutral ↔ coral). */
  div: [
    'var(--chart-div-low)',
    'var(--chart-div-low-mid)',
    'var(--chart-div-mid)',
    'var(--chart-div-high-mid)',
    'var(--chart-div-high)',
  ],
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
  /** Separator between adjacent marks (slices, cells): the surface the chart sits on. */
  separator: 'var(--panel)',
  label: 'var(--muted-foreground)',
  text: 'var(--foreground)',
  anomaly: 'var(--alert)',
  highlight: 'var(--signal)',
  tooltip: {
    background: 'var(--panel-raised)',
    border: 'var(--rule)',
    text: 'var(--foreground)',
    muted: 'var(--muted-foreground)',
  },
  fontMono: fontFamilies.mono.join(', '),
} as const;

export type ChartTheme = typeof chartTheme;
