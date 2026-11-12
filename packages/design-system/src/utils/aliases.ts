import type { SystemThemeColors } from '@aazucena/types';

/**
 * shadcn-compatible aliases (`--card`, `--muted`, `--ring`, `--chart-1`, `--sidebar-*`…)
 * referenced by `@aazucena/ui` globals.css `@theme`. Derived as concrete values so they
 * follow whichever vibe is applied (a `var()` alias on :root would pin the default vibe).
 * Instrument roles win; legacy roles are the fallback for vibes that predate them.
 */
/** Give a color an alpha channel, keeping it a single CSS value. */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('oklch(') && !color.includes('/')) return color.replace(')', ` / ${alpha})`);
  return `color-mix(in oklch, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

/**
 * Instrument roles a vibe left out, derived from its legacy roles so every vibe brings
 * its own accent (signal = primary) and surfaces. Roles the vibe defines are not repeated.
 */
function deriveInstrumentRoles(c: SystemThemeColors): Record<string, string> {
  const signal = c.signal ?? c.primary;
  const derived: Record<string, string | undefined> = {
    signal: c.signal ? undefined : signal,
    'signal-foreground': c.signalForeground ? undefined : c.primaryForeground,
    'signal-faint': c.signalFaint ? undefined : withAlpha(signal, 0.08),
    'signal-subtle': c.signalSubtle ? undefined : withAlpha(signal, 0.15),
    'signal-line': c.signalLine ? undefined : withAlpha(signal, 0.4),
    panel: c.panel ? undefined : c.cardBackground,
    'panel-raised': c.panelRaised ? undefined : c.floating,
    rule: c.rule ? undefined : c.border,
    'rule-strong': c.ruleStrong ? undefined : c.border,
    state: c.state ? undefined : c.elevated,
    'series-1': c.series1 ? undefined : signal,
  };
  return Object.fromEntries(
    Object.entries(derived).filter((e): e is [string, string] => Boolean(e[1])),
  );
}

export function deriveAliases(c: SystemThemeColors): Record<string, string> {
  const card = c.panel ?? c.cardBackground;
  const raised = c.panelRaised ?? c.floating;
  const ring = c.signal ?? c.primary;
  const rule = c.rule ?? c.border;
  return {
    ...deriveInstrumentRoles(c),
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
