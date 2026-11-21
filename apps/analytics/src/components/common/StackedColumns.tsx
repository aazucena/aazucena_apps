import { cn } from '@/lib/utils';

export interface ColumnSegment {
  name: string;
  value: number;
  /** A `var()` series colour; defaults to the signal colour. */
  color?: string;
}

export interface ColumnDatum {
  key: string;
  label: string;
  segments: ColumnSegment[];
}

interface StackedColumnsProps {
  data: ColumnDatum[];
  /** Plot height in px. */
  height?: number;
  format?: (value: number) => string;
  /** Accessible summary of the whole chart. */
  summary: string;
  className?: string;
}

/**
 * Columns, optionally stacked. Fills are set outright (never tweened between var() colours);
 * each column carries its values as a title and in the accessible summary.
 */
export function StackedColumns({
  data,
  height = 180,
  format = (v) => v.toLocaleString(),
  summary,
  className,
}: StackedColumnsProps) {
  const totals = data.map((d) => d.segments.reduce((s, x) => s + x.value, 0));
  const max = Math.max(...totals, 1);
  return (
    <div
      role="img"
      aria-label={summary}
      className={cn('border-rule flex items-end gap-1 border-b', className)}
      style={{ height }}
    >
      {data.map((d, i) => (
        <div
          key={d.key}
          className="flex min-w-0 flex-1 flex-col-reverse justify-start"
          style={{ height: `${((totals[i] ?? 0) / max) * 100}%` }}
          title={`${d.label}: ${format(totals[i] ?? 0)}${
            d.segments.length > 1
              ? ` (${d.segments.map((s) => `${s.name} ${format(s.value)}`).join(', ')})`
              : ''
          }`}
        >
          {d.segments.map((s) => (
            <div
              key={s.name}
              className={cn(!s.color && 'bg-signal')}
              style={{
                height: `${totals[i] ? (s.value / (totals[i] ?? 1)) * 100 : 0}%`,
                backgroundColor: s.color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
