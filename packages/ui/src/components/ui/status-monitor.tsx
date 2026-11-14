'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

export const statusMonitorVariants = cva('overflow-hidden rounded-card border', {
  variants: {
    variant: {
      default: 'bg-background border-border text-foreground',
      glass: 'glass text-foreground',
      cyber:
        'glass bg-signal-faint border-signal/30 text-foreground dark:bg-background/80 dark:bg-panel dark:text-signal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const StatusMonitor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorVariants({ variant }), className)} {...props} />
));
StatusMonitor.displayName = 'StatusMonitor';

export const statusMonitorHeaderVariants = cva(
  'flex items-center justify-between border-b px-8 py-6 transition-colors duration-(--motion-base)',
  {
    variants: {
      status: {
        NOMINAL: 'border-success/20 bg-success/10',
        WARNING: 'border-warning/20 bg-warning/10',
        CRITICAL: 'border-alert/20 bg-alert/10',
      },
    },
    defaultVariants: {
      status: 'NOMINAL',
    },
  },
);

export const StatusMonitorHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorHeaderVariants>
>(({ className, status, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorHeaderVariants({ status }), className)} {...props} />
));
StatusMonitorHeader.displayName = 'StatusMonitorHeader';

export const statusMonitorIconVariants = cva(
  'flex h-12 w-12 items-center justify-center rounded-card transition-colors duration-(--motion-base)',
  {
    variants: {
      status: {
        NOMINAL: 'bg-success text-success-foreground',
        WARNING: 'bg-warning text-warning-foreground',
        CRITICAL: 'animate-pulse bg-alert text-alert-foreground',
      },
    },
    defaultVariants: {
      status: 'NOMINAL',
    },
  },
);

export const StatusMonitorIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorIconVariants>
>(({ className, status, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorIconVariants({ status }), className)} {...props} />
));
StatusMonitorIcon.displayName = 'StatusMonitorIcon';

export const StatusMonitorTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-1 text-[10px] font-black tracking-[0.3em] uppercase opacity-60', className)}
    {...props}
  />
));
StatusMonitorTitle.displayName = 'StatusMonitorTitle';

export const statusMonitorValueVariants = cva(
  'text-xl font-black tracking-tighter uppercase transition-colors duration-(--motion-base)',
  {
    variants: {
      status: {
        NOMINAL: 'text-success',
        WARNING: 'text-warning',
        CRITICAL: 'text-alert',
      },
    },
    defaultVariants: {
      status: 'NOMINAL',
    },
  },
);

export const StatusMonitorValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorValueVariants>
>(({ className, status, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorValueVariants({ status }), className)} {...props} />
));
StatusMonitorValue.displayName = 'StatusMonitorValue';

export const StatusMonitorContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('min-h-[200px] p-6', className)} {...props} />
));
StatusMonitorContent.displayName = 'StatusMonitorContent';

export const StatusMonitorFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'glass' | 'cyber' }
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-t px-8 py-4',
      variant === 'cyber' ? 'border-signal/20 bg-panel-raised/20' : 'border-border bg-muted/50',
      className,
    )}
    {...props}
  />
));
StatusMonitorFooter.displayName = 'StatusMonitorFooter';

export * from './status-monitor-log';
export * from './status-monitor-alert';
