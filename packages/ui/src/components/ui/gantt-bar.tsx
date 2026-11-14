'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const ganttBarVariants = cva(
  'absolute flex h-8 items-center rounded-control px-2 text-xs font-medium transition-[left,width,filter] hover:brightness-110 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        glass: 'glass text-foreground',
        cyber: 'bg-signal/20 border border-signal/40 text-signal',
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
            className="rounded-control bg-panel-raised absolute inset-y-0 left-0"
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
