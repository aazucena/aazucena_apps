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
  /** Extra qualifier shown in text, e.g. `to date`. */
  note?: string;
  segments: ColumnSegment[];
}

interface StackedColumnsProps {
  data: ColumnDatum[];
  /** Plot height in px. */
  height?: number;
  format?: (value: number) => string;
  /** Accessible summary of the whole chart. */
  summary: string;
  /** Shown instead of the peak when every column is zero. */
  emptyLabel?: string;
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
  emptyLabel = 'No values in window',
  className,
}: StackedColumnsProps) {
  const totals = data.map((d) => d.segments.reduce((s, x) => s + x.value, 0));
  const max = Math.max(...totals, 1);
  const labelOf = (d: ColumnDatum) => (d.note ? `${d.label} (${d.note})` : d.label);
  const peakIdx = totals.indexOf(Math.max(...totals));
  const peak = data[peakIdx];
  const names = Array.from(new Set(data.flatMap((d) => d.segments.map((s) => s.name))));
  const multi = names.length > 1;
  return (
    <div className={className}>
      {peak && Math.max(...totals) > 0 ? (
        <p className="micro-label text-muted-foreground pb-2">
          PEAK {format(totals[peakIdx] ?? 0)} · {labelOf(peak).toUpperCase()}
        </p>
      ) : (
        <p className="micro-label text-muted-foreground pb-2">{emptyLabel.toUpperCase()}</p>
      )}
      <div aria-hidden className="border-rule flex items-end gap-1 border-b" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={d.key}
            className="flex min-w-0 flex-1 flex-col-reverse justify-start"
            style={{ height: `${((totals[i] ?? 0) / max) * 100}%` }}
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
      <table className="sr-only">
        <caption>{summary}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            {multi &&
              names.map((n) => (
                <th key={n} scope="col">
                  {n}
                </th>
              ))}
            <th scope="col">{multi ? 'Total' : 'Value'}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.key}>
              <th scope="row">{labelOf(d)}</th>
              {multi &&
                names.map((n) => (
                  <td key={n}>{format(d.segments.find((s) => s.name === n)?.value ?? 0)}</td>
                ))}
              <td>{format(totals[i] ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
