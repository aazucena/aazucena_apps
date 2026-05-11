'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Badge } from '../../ui/badge'; // Assuming Badge component is available
import { CheckCircle, Circle, XCircle, ClockCircle } from '@aazucena/icons'; // Assuming these icons are available

const chatTaskVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

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
  todo: 'bg-gray-500/20 text-gray-500',
  'in-progress': 'bg-blue-500/20 text-blue-500',
  done: 'bg-green-500/20 text-green-500',
  cancelled: 'bg-red-500/20 text-red-500',
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
                'bg-red-500/20 text-red-500': task.priority === 'high',
                'bg-yellow-500/20 text-yellow-500': task.priority === 'medium',
                'bg-blue-500/20 text-blue-500': task.priority === 'low',
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
