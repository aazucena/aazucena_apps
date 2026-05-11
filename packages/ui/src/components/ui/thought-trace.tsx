'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const thoughtTraceVariants = cva('flex flex-col gap-3 transition-all duration-500', {
  variants: {
    variant: {
      default: 'text-zinc-400 dark:text-zinc-500',
      cyber: 'text-foreground0/60 font-mono',
      ai: 'text-primary-500/60 font-mono',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const ThoughtTrace = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof thoughtTraceVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(thoughtTraceVariants({ variant }), className)} {...props} />
));
ThoughtTrace.displayName = 'ThoughtTrace';

const thoughtStepVariants = cva(
  'flex items-center gap-2 text-[10px] font-mono animate-in fade-in slide-in-from-left-2 duration-300',
  {
    variants: {
      status: {
        pending: 'opacity-40',
        active: 'opacity-100 font-bold',
        completed: 'opacity-60',
      },
      variant: {
        default: '',
        cyber: 'tracking-tighter uppercase',
        ai: 'tracking-widest uppercase',
      },
    },
    defaultVariants: {
      status: 'active',
      variant: 'default',
    },
  },
);

const ThoughtStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof thoughtStepVariants>
>(({ className, status, variant, children, ...props }, ref) => (
  <div ref={ref} className={cn(thoughtStepVariants({ status, variant }), className)} {...props}>
    <div
      className={cn(
        'h-1 w-1 shrink-0 rounded-full',
        status === 'active'
          ? 'animate-pulse bg-current shadow-[0_0_8px_currentColor]'
          : 'bg-current opacity-40',
      )}
    />
    <span className="truncate">{children}</span>
    {status === 'active' && <span className="animate-pulse">...</span>}
  </div>
));
ThoughtStep.displayName = 'ThoughtStep';

export { ThoughtStep, thoughtStepVariants, ThoughtTrace, thoughtTraceVariants };
