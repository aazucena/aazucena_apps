import type { SystemThemeColors } from '@aazucena/types';

/**
 * shadcn-compatible aliases (`--card`, `--muted`, `--ring`, `--chart-1`, `--sidebar-*`…)
 * referenced by `@aazucena/ui` globals.css `@theme`. Derived as concrete values so they
 * follow whichever vibe is applied (a `var()` alias on :root would pin the default vibe).
 * Instrument roles win; legacy roles are the fallback for vibes that predate them.
 */
export function deriveAliases(c: SystemThemeColors): Record<string, string> {
  const card = c.panel ?? c.cardBackground;
  const raised = c.panelRaised ?? c.floating;
  const ring = c.signal ?? c.primary;
  const rule = c.rule ?? c.border;
  return {
    card,
    'card-foreground': c.foreground,
    popover: raised,
    'popover-foreground': c.foreground,
    muted: raised,
    input: c.ruleStrong ?? c.border,
    ring,
    'chart-1': c.series1 ?? c.primary,
    'chart-2': c.series2 ?? c.secondary,
    'chart-3': c.series3 ?? c.accent,
    'chart-4': c.series4 ?? c.success,
    'chart-5': c.chartSeq3 ?? c.mutedForeground,
    sidebar: card,
    'sidebar-foreground': c.foreground,
    'sidebar-primary': ring,
    'sidebar-primary-foreground': c.signalForeground ?? c.primaryForeground,
    'sidebar-accent': c.state ?? c.elevated,
    'sidebar-accent-foreground': c.foreground,
    'sidebar-border': rule,
    'sidebar-ring': ring,
  };
}
