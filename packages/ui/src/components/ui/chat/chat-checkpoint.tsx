'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CheckCircle, XCircle, ClockCircle, CircleDashed } from '@aazucena/icons'; // Assuming these icons are available

const chatCheckpointVariants = cva(
  'flex items-center gap-3 rounded-md border p-3 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
      status: {
        success: 'border-green-500/20 text-green-500',
        failure: 'border-red-500/20 text-red-500',
        pending: 'border-gray-500/20 text-gray-500',
        current: 'border-blue-500/20 text-blue-500 animate-pulse',
      },
    },
    defaultVariants: { variant: 'default', status: 'pending' },
  },
);

export interface ChatCheckpointProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatCheckpointVariants> {
  label: string;
  status: 'success' | 'failure' | 'pending' | 'current';
  timestamp?: string; // e.g., "HH:MM:SS" or "YYYY-MM-DD HH:MM"
}

const statusIconMap: Record<ChatCheckpointProps['status'], React.ElementType> = {
  success: CheckCircle,
  failure: XCircle,
  pending: CircleDashed,
  current: ClockCircle, // Using ClockCircle for current/in-progress
};

const ChatCheckpoint = React.forwardRef<HTMLDivElement, ChatCheckpointProps>(
  ({ className, variant, status, label, timestamp, ...props }, ref) => {
    const Icon = statusIconMap[status] as React.ComponentType<{ className?: string }>;

    return (
      <div
        ref={ref}
        className={cn(chatCheckpointVariants({ variant, status }), className)}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5 shrink-0" />}
        <div className="flex flex-grow flex-col">
          <span className="font-medium">{label}</span>
          {timestamp && <span className="text-muted-foreground text-xs">{timestamp}</span>}
        </div>
      </div>
    );
  },
);
ChatCheckpoint.displayName = 'ChatCheckpoint';

export { ChatCheckpoint, chatCheckpointVariants };
