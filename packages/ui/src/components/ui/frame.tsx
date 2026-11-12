'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { X, Minus, Square } from '@aazucena/icons'; // Assuming these icons are available

const frameVariants = cva('relative flex flex-col overflow-hidden rounded-control', {
  variants: {
    variant: {
      default: 'bg-card border border-border',
      glass: 'bg-state border-rule text-foreground',
      cyber: 'bg-background border border-signal/20 text-signal',
    },
    size: {
      sm: 'w-64 h-48',
      default: 'w-96 h-64',
      lg: 'w-[48rem] h-[32rem]', // 16:9 aspect ratio
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface FrameProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof frameVariants> {
  title?: string;
  children?: React.ReactNode;
  showControls?: boolean;
}

const Frame = React.forwardRef<HTMLDivElement, FrameProps>(
  ({ className, variant, size, title, children, showControls = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(frameVariants({ variant, size }), className)} {...props}>
        {/* Title Bar */}
        <div
          className={cn(
            'flex items-center justify-between border-b px-3 py-2 text-sm font-medium',
            variant === 'cyber' ? 'border-signal/20 bg-signal/5' : 'border-border bg-muted/50',
            variant === 'glass' && 'border-rule bg-state text-foreground',
          )}
        >
          <div className="flex items-center gap-2">
            {showControls && (
              <div className="flex gap-1.5">
                <span className="bg-alert size-2.5 rounded-full" />
                <span className="bg-warning size-2.5 rounded-full" />
                <span className="bg-success size-2.5 rounded-full" />
              </div>
            )}
            <span
              className={cn(
                variant === 'cyber' && 'text-signal font-mono',
                variant === 'glass' && 'text-foreground/90',
              )}
            >
              {title}
            </span>
          </div>
          {showControls && (
            <div
              className={cn(
                'flex gap-2',
                variant === 'cyber' && 'text-signal/60',
                variant === 'glass' && 'text-foreground/60',
              )}
            >
              <Minus size={14} />
              <Square size={14} />
              <X size={14} />
            </div>
          )}
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    );
  },
);
Frame.displayName = 'Frame';

export { Frame, frameVariants };
