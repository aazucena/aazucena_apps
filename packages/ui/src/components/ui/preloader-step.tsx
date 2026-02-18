'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CircleNotch, CheckCircleSolid } from '@aazucena/icons';
import { Badge } from './badge.js';

/**
 * Preloader Progress & Step Components
 */

export const preloaderIndicatorVariants = cva(
  'relative flex items-center justify-center rounded-full transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'h-20 w-20',
        sm: 'h-12 w-12',
        lg: 'h-24 w-24',
      },
      theme: {
        default: 'text-primary',
        glass: 'text-foreground',
        cyber: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      theme: 'default',
    },
  },
);

export const PreloaderIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof preloaderIndicatorVariants> & { progress?: number }
>(({ className, variant, theme, progress, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(preloaderIndicatorVariants({ variant, theme }), className)}
    {...props}
  >
    <CircleNotch className="h-full w-full animate-spin opacity-20" />
    <CircleNotch
      className="absolute inset-0 h-full w-full animate-spin"
      style={{ clipPath: `inset(${100 - (progress || 0)}% 0 0 0)` }}
    />
    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
      {children || (progress !== undefined ? `${Math.round(progress)}%` : null)}
    </div>
  </div>
));
PreloaderIndicator.displayName = 'PreloaderIndicator';

export const preloaderStepVariants = cva(
  'flex items-center gap-3 rounded-xl border p-3 transition-all duration-300',
  {
    variants: {
      status: {
        pending: 'border-border opacity-40',
        active: 'border-primary bg-primary/5 animate-pulse',
        completed: 'border-success/30 bg-success/5',
      },
      theme: {
        default: '',
        glass: 'text-foreground border-border/10 dark:border-white/10',
        cyber: 'text-foreground border-border/10 dark:border-cyan-500/20',
      },
    },
    defaultVariants: {
      status: 'pending',
      theme: 'default',
    },
  },
);

export const PreloaderStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof preloaderStepVariants> & { icon?: React.ReactNode }
>(({ className, status, theme, icon, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(preloaderStepVariants({ status, theme }), className)}
    role="listitem"
    {...props}
  >
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all',
        status === 'active'
          ? 'bg-primary text-primary-foreground border-primary'
          : status === 'completed'
            ? 'bg-success text-success-foreground border-success'
            : 'bg-muted text-muted-foreground border-border',
      )}
    >
      {status === 'completed' ? <CheckCircleSolid className="h-4 w-4" /> : icon}
    </div>
    <div className="min-w-0 flex-1 text-left">{children}</div>
    {status === 'active' && (
      <Badge variant="outline" className="h-5 animate-pulse px-1.5 text-[10px]">
        Processing
      </Badge>
    )}
  </div>
));
PreloaderStep.displayName = 'PreloaderStep';

export const PreloaderSteps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('grid w-full gap-2', className)} role="list" {...props} />
));
PreloaderSteps.displayName = 'PreloaderSteps';
