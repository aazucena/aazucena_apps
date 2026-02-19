'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

export const statusMonitorVariants = cva(
  'overflow-hidden rounded-[2rem] border shadow-lg backdrop-blur-md transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'bg-background border-border text-foreground',
        glass: 'glass text-foreground dark:text-white shadow-2xl',
        cyber:
          'glass bg-primary-100 border-cyan-500/30 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.15)] dark:bg-background/80 dark:bg-black/80 dark:text-cyan-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const StatusMonitor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statusMonitorVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(statusMonitorVariants({ variant }), className)} {...props} />
));
StatusMonitor.displayName = 'StatusMonitor';

export const statusMonitorHeaderVariants = cva(
  'flex items-center justify-between border-b px-8 py-6 transition-colors duration-500',
  {
    variants: {
      status: {
        NOMINAL: 'border-emerald-500/20 bg-emerald-500/10',
        WARNING: 'border-amber-500/20 bg-amber-500/10',
        CRITICAL: 'border-rose-500/20 bg-rose-500/10',
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
  'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500',
  {
    variants: {
      status: {
        NOMINAL: 'bg-emerald-500 text-foreground shadow-[0_0_20px_rgba(16,185,129,0.2)]',
        WARNING: 'bg-amber-500 text-foreground shadow-[0_0_20px_rgba(245,158,11,0.4)]',
        CRITICAL: 'animate-pulse bg-rose-500 text-foreground shadow-[0_0_20px_rgba(244,63,94,0.4)]',
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
  'text-xl font-black tracking-tighter uppercase transition-colors duration-500',
  {
    variants: {
      status: {
        NOMINAL: 'text-emerald-500',
        WARNING: 'text-amber-500',
        CRITICAL: 'text-rose-500',
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
      variant === 'cyber' ? 'border-cyan-500/20 bg-cyan-950/20' : 'border-border bg-muted/50',
      className,
    )}
    {...props}
  />
));
StatusMonitorFooter.displayName = 'StatusMonitorFooter';

export * from './status-monitor-log.js';
export * from './status-monitor-alert.js';
