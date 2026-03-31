'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { GanttBar, type GanttTask } from './gantt-bar';

export * from './gantt-bar';

const ganttVariants = cva('overflow-x-auto rounded-md border transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      glass: 'glass border-border/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface GanttProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof ganttVariants> {
  tasks: GanttTask[];
  startDate?: Date;
  endDate?: Date;
  dayWidth?: number;
  onTaskClick?: (task: GanttTask) => void;
}

const daysBetween = (a: Date, b: Date) =>
  Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86400000));

const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
  (
    {
      className,
      variant,
      tasks,
      startDate: startProp,
      endDate: endProp,
      dayWidth = 30,
      onTaskClick,
      ...props
    },
    ref,
  ) => {
    const minDate =
      startProp ??
      (tasks.length ? new Date(Math.min(...tasks.map((t) => t.start.getTime()))) : new Date());
    const maxDate =
      endProp ??
      (tasks.length
        ? new Date(Math.max(...tasks.map((t) => t.end.getTime())))
        : addDays(new Date(), 30));

    const startDate = addDays(minDate, -1);
    const totalDays = daysBetween(startDate, maxDate) + 2;
    const totalWidth = totalDays * dayWidth;

    // Build date labels
    const dates: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
      dates.push(addDays(startDate, i));
    }

    // Row assignment
    const rows: GanttTask[][] = [];
    for (const task of tasks) {
      if (task.row != null) {
        while (rows.length <= task.row) rows.push([]);
        rows[task.row]!.push(task);
      } else {
        let placed = false;
        for (const row of rows) {
          const overlaps = row.some((t) => task.start < t.end && task.end > t.start);
          if (!overlaps) {
            row.push(task);
            placed = true;
            break;
          }
        }
        if (!placed) rows.push([task]);
      }
    }

    const today = new Date();
    const todayOffset = daysBetween(startDate, today);

    return (
      <div ref={ref} className={cn(ganttVariants({ variant }), className)} {...props}>
        <div style={{ width: totalWidth, minWidth: '100%' }}>
          {/* Header */}
          <div className="border-border/50 flex border-b">
            {dates.map((d, i) => (
              <div
                key={i}
                className="border-border/20 text-muted-foreground shrink-0 border-r px-1 py-1.5 text-center text-[10px]"
                style={{ width: dayWidth }}
              >
                <div>{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="relative">
            {/* Today marker */}
            {todayOffset >= 0 && todayOffset <= totalDays && (
              <div
                className="bg-destructive/50 absolute top-0 bottom-0 z-10 w-px"
                style={{ left: todayOffset * dayWidth }}
              />
            )}

            {rows.map((row, ri) => (
              <div key={ri} className="border-border/10 relative border-b" style={{ height: 40 }}>
                {row.map((task) => (
                  <GanttBar
                    key={task.id}
                    task={task}
                    dayWidth={dayWidth}
                    startDate={startDate}
                    variant={variant}
                    onClick={onTaskClick}
                    style={{ top: 4 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
Gantt.displayName = 'Gantt';

export { Gantt, ganttVariants };
