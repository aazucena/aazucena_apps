'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { X, Minus, Square } from '@aazucena/icons'; // Assuming these icons are available

const frameVariants = cva('relative flex flex-col overflow-hidden rounded-lg shadow-xl', {
  variants: {
    variant: {
      default: 'bg-card border border-border',
      glass: 'bg-white/5 border-white/10 text-white backdrop-blur-md',
      cyber: 'bg-black border border-cyan-500/20 text-cyan-50',
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
            variant === 'cyber' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-border bg-muted/50',
            variant === 'glass' && 'border-white/10 bg-white/10 text-white',
          )}
        >
          <div className="flex items-center gap-2">
            {showControls && (
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-500" />
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span className="size-2.5 rounded-full bg-emerald-500" />
              </div>
            )}
            <span
              className={cn(
                variant === 'cyber' && 'font-mono text-cyan-400',
                variant === 'glass' && 'text-white/90',
              )}
            >
              {title}
            </span>
          </div>
          {showControls && (
            <div
              className={cn(
                'flex gap-2',
                variant === 'cyber' && 'text-cyan-500/60',
                variant === 'glass' && 'text-white/60',
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
