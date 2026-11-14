'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Badge } from '../../ui/badge'; // Assuming Badge component is available
import { CheckCircle, Circle, XCircle, ClockCircle } from '@aazucena/icons'; // Assuming these icons are available

const chatTaskVariants = cva('flex flex-col gap-3 rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';

export interface ChatTaskProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatTaskVariants> {
  task: {
    id: string;
    description: string;
    status: TaskStatus;
    assignedTo?: string;
    dueDate?: string; // e.g., "YYYY-MM-DD"
    priority?: 'low' | 'medium' | 'high';
  };
}

const statusColorMap: Record<TaskStatus, string> = {
  todo: 'bg-rule-strong/20 text-muted-foreground',
  'in-progress': 'bg-signal/20 text-signal',
  done: 'bg-success/20 text-success',
  cancelled: 'bg-alert/20 text-alert',
};

const statusIconMap: Record<TaskStatus, React.ElementType> = {
  todo: Circle,
  'in-progress': ClockCircle,
  done: CheckCircle,
  cancelled: XCircle,
};

const ChatTask = React.forwardRef<HTMLDivElement, ChatTaskProps>(
  ({ className, variant, task, ...props }, ref) => {
    const StatusIcon = statusIconMap[task.status] as React.ComponentType<{ className?: string }>;
    return (
      <div ref={ref} className={cn(chatTaskVariants({ variant }), className)} {...props}>
        <div className="flex items-center gap-2 text-lg font-semibold">
          <StatusIcon className={cn('h-5 w-5', statusColorMap[task.status])} />
          <h4>{task.description}</h4>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge className={statusColorMap[task.status]}>{task.status.replace('-', ' ')}</Badge>
          {task.assignedTo && <Badge variant="secondary">Assigned: {task.assignedTo}</Badge>}
          {task.dueDate && <Badge variant="secondary">Due: {task.dueDate}</Badge>}
          {task.priority && (
            <Badge
              className={cn({
                'bg-alert/20 text-alert': task.priority === 'high',
                'bg-warning/20 text-warning': task.priority === 'medium',
                'bg-signal/20 text-signal': task.priority === 'low',
              })}
            >
              Priority: {task.priority}
            </Badge>
          )}
        </div>
      </div>
    );
  },
);
ChatTask.displayName = 'ChatTask';

export { ChatTask, chatTaskVariants };
