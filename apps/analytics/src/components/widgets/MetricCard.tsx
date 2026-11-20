// apps/analytics/src/components/widgets/MetricCard.tsx
/**
 * KPI strip cell: micro-label name, mono value, optional delta with a direction glyph.
 * A strip is a row of these cells divided by 1px rules (see the Overview page).
 */

import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  value?: string;
  label?: string;
  /** Caption beside the value, in the copy voice (`AVG_45S_PLAYBACK`). */
  description?: string;
  /** Movement text without the glyph (`12% VS PRIOR`); needs `trend`. */
  delta?: string;
  trend?: 'up' | 'down';
  /** Which direction is good for this metric. Coral shows only for the bad direction. */
  goodDirection?: 'up' | 'down';
  /** Kept for existing callers; the instrument cell carries no icon. */
  icon?: JSX.Element;
  className?: string;
  /** Kept for existing callers; colour comes from the delta, not the variant. */
  variant?: 'primary' | 'secondary' | 'success' | 'rose' | 'default';
}

export function MetricCard({
  value,
  label,
  description,
  delta,
  trend,
  goodDirection = 'up',
  className,
}: MetricCardProps): JSX.Element {
  const isBad = trend !== undefined && trend !== goodDirection;
  const glyph = trend === 'down' ? '▼' : '▲';

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-card border border-rule bg-panel px-5 py-4',
        className,
      )}
    >
      <div className="micro-label text-muted-foreground">{label}</div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
        <div
          className={cn(
            'font-mono text-2xl font-light tabular-nums',
            isBad ? 'text-alert' : 'text-foreground',
          )}
        >
          {value}
        </div>
        {trend && (
          <div
            className={cn(
              'micro-label flex items-center gap-1',
              isBad ? 'text-alert' : 'text-success',
            )}
          >
            <span aria-hidden>{glyph}</span>
            {delta}
          </div>
        )}
        {description && <div className="micro-label text-muted-foreground">{description}</div>}
      </div>
    </div>
  );
}
