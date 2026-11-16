import * as d3 from 'd3';
import { chartTheme } from '@aazucena/design-system/tokens/chart';

export { chartTheme };

/**
 * Categorical colors: the four locked series, then the same four mixed toward the
 * panel for charts with more than four groups (mixed in OKLab so each tint keeps its
 * series hue; OKLCH would rotate it toward the panel blue). Values are CSS, so they follow the
 * vibe and light/dark mode; SVG `fill`/`stroke` resolve them at paint time.
 */
const tint = (c: string) => `color-mix(in oklab, ${c} 50%, var(--panel))`;
const [s1, s2, s3, s4] = chartTheme.series;
// A fixed-length tuple, so `categorical[2]` is a string rather than string | undefined
export const categorical = [s1, s2, s3, s4, tint(s1), tint(s2), tint(s3), tint(s4)] as const;

/** Ordinal scale over `categorical`. Groups past eight repeat the cycle. */
export function categoricalScale(domain?: readonly string[]) {
  const scale = d3.scaleOrdinal<string, string>().range(categorical);
  return domain ? scale.domain(domain) : scale;
}

/**
 * Text color for a label drawn on a categorical fill. The four full series reach AA
 * against the panel color; the mixed tints are light in both modes, so they take
 * foreground text instead.
 */
export function labelOn(fill: string): string {
  return fill.startsWith('color-mix') ? chartTheme.text : chartTheme.separator;
}

/**
 * Binned sequential scale on the five-step ramp. CSS variables can't be interpolated
 * numerically, and five readable steps beat a continuous ramp nobody can decode.
 */
export function sequentialScale(domain: [number, number]) {
  return d3.scaleQuantize<string>().domain(domain).range(chartTheme.seq);
}

/**
 * The one chart tooltip: raised panel, 1px rule, mono text, no blur or shadow.
 * Shared by every chart, keyed by class so each chart reuses its own node.
 */
export function chartTooltip(className = 'viz-tooltip') {
  return d3
    .select('body')
    .selectAll<HTMLDivElement, number>(`div.${className}`)
    .data([0])
    .join('div')
    .attr('class', className)
    .attr('role', 'tooltip')
    .style('position', 'absolute')
    .style('background', chartTheme.tooltip.background)
    .style('color', chartTheme.tooltip.text)
    .style('border', `1px solid ${chartTheme.tooltip.border}`)
    .style('border-radius', 'var(--radius-control, 4px)')
    .style('padding', '6px 10px')
    .style('font-family', chartTheme.fontMono)
    .style('font-size', '11px')
    .style('line-height', '1.4')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', 'var(--z-tooltip, 1800)');
}

/** Small chart control: 30px tall, 4px radius, state-tone hover, signal focus ring. */
export const chartControl =
  'inline-flex h-(--control-sm) min-w-(--control-sm) items-center justify-center gap-1.5 rounded-[var(--radius-control,4px)] text-xs font-medium text-(--foreground) transition-colors hover:bg-(--state) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--signal)';

/** A pressed chart toggle: state tone with signal text. */
export const chartControlOn = 'bg-(--state) text-(--signal)';

/** Mono micro-caps text for text-labelled chart controls and legends. */
export const chartMicro = 'font-mono text-[10px] uppercase tracking-[0.12em]';
