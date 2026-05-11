'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const ganttBarVariants = cva(
  'absolute flex h-8 items-center rounded-md px-2 text-xs font-medium transition-all hover:brightness-110 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        glass: 'glass-m text-foreground',
        cyber:
          'bg-cyan-500/20 border border-cyan-500/40 text-cyan-50 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface GanttTask {
  id: string;
  label: string;
  start: Date;
  end: Date;
  progress?: number;
  color?: string;
  row?: number;
}

export interface GanttBarProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof ganttBarVariants> {
  task: GanttTask;
  dayWidth: number;
  startDate: Date;
  onClick?: (task: GanttTask) => void;
}

const daysBetween = (a: Date, b: Date) =>
  Math.max(1, Math.ceil((b.getTime() - a.getTime()) / 86400000));

const GanttBar = React.forwardRef<HTMLDivElement, GanttBarProps>(
  ({ className, variant, task, dayWidth, startDate, onClick, style, ...props }, ref) => {
    const offset = daysBetween(startDate, task.start);
    const duration = daysBetween(task.start, task.end);

    return (
      <div
        ref={ref}
        className={cn(ganttBarVariants({ variant }), className)}
        style={{
          left: offset * dayWidth,
          width: duration * dayWidth - 4,
          backgroundColor: task.color,
          ...style,
        }}
        onClick={() => onClick?.(task)}
        title={`${task.label}: ${task.start.toLocaleDateString()} – ${task.end.toLocaleDateString()}`}
        {...props}
      >
        {task.progress != null && (
          <div
            className="absolute inset-y-0 left-0 rounded-md bg-white/20"
            style={{ width: `${task.progress}%` }}
          />
        )}
        <span className="relative z-10 truncate">{task.label}</span>
      </div>
    );
  },
);
GanttBar.displayName = 'GanttBar';

export { GanttBar, ganttBarVariants };
