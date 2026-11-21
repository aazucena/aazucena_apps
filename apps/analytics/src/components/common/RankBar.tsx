import { cn } from '@/lib/utils';

interface RankBarProps {
  label: string;
  /** Text shown beside the bar; colour is never the only carrier. */
  value: string;
  /** Bar fill, 0 to 100. */
  percent: number;
  /** A `var()` series colour; defaults to the signal colour. */
  color?: string;
  hint?: string;
  className?: string;
}

/** One row of a ranking: label, track with fill, value text. */
export function RankBar({ label, value, percent, color, hint, className }: RankBarProps) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto] items-center gap-4',
        className,
      )}
    >
      <span className="truncate text-sm" title={hint ? `${label} (${hint})` : label}>
        {label}
      </span>
      <div aria-hidden className="bg-state h-1.5 overflow-hidden">
        <div
          className={cn('h-full', !color && 'bg-signal')}
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-muted-foreground min-w-10 text-right font-mono text-xs tabular-nums">
        {value}
      </span>
    </div>
  );
}
