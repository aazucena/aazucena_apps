'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CheckCircle, InfoCircle, DangerTriangle, DangerCircle } from '@aazucena/icons';

/* ─── Status icon defaults ─────────────────────────────────────────────────── */

const STATUS_ICONS = {
  success: CheckCircle,
  info: InfoCircle,
  warning: DangerTriangle,
  error: DangerCircle,
} as const;

/* ─── CVA: Result (root) ───────────────────────────────────────────────────── */

const resultVariants = cva(
  'flex flex-col items-center justify-center text-center rounded-2xl border p-8 md:p-12 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background shadow-sm',
        glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-xl border-border/10 shadow-2xl',
        cyber:
          'bg-background dark:bg-black border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      },
      status: {
        success: 'border-emerald-500/30',
        info: 'border-blue-500/30',
        warning: 'border-amber-500/30',
        error: 'border-rose-500/30',
      },
      size: {
        sm: 'p-6 max-w-sm gap-3',
        default: 'p-8 md:p-12 max-w-lg gap-4',
        lg: 'p-12 md:p-16 max-w-2xl gap-5',
      },
    },
    compoundVariants: [
      { variant: 'cyber', status: 'success', className: 'border-cyan-500/30' },
      { variant: 'cyber', status: 'info', className: 'border-cyan-500/30' },
      { variant: 'cyber', status: 'warning', className: 'border-cyan-500/30' },
      { variant: 'cyber', status: 'error', className: 'border-cyan-500/30' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/* ─── CVA: ResultIcon ──────────────────────────────────────────────────────── */

const resultIconVariants = cva(
  'relative flex shrink-0 items-center justify-center rounded-full ring-4 transition-all duration-300',
  {
    variants: {
      status: {
        success:
          'bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-400',
        info: 'bg-blue-50 text-blue-600 ring-blue-500/20 dark:bg-blue-950/50 dark:text-blue-400',
        warning:
          'bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-400',
        error: 'bg-rose-50 text-rose-600 ring-rose-500/20 dark:bg-rose-950/50 dark:text-rose-400',
      },
      size: {
        sm: 'size-12 [&_svg]:size-5',
        default: 'size-16 [&_svg]:size-7',
        lg: 'size-24 [&_svg]:size-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

/* ─── Sub-components ───────────────────────────────────────────────────────── */

const Result = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof resultVariants>
>(({ className, variant, status, size, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="result"
    className={cn(resultVariants({ variant, status, size }), className)}
    {...props}
  />
));
Result.displayName = 'Result';

const ResultIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof resultIconVariants> & {
      icon?: React.ReactNode;
    }
>(({ className, status, size, icon, ...props }, ref) => {
  const DefaultIcon = status ? STATUS_ICONS[status] : undefined;

  return (
    <div
      ref={ref}
      data-slot="result-icon"
      className={cn(resultIconVariants({ status, size }), className)}
      {...props}
    >
      {icon ?? (DefaultIcon ? <DefaultIcon /> : null)}
    </div>
  );
});
ResultIcon.displayName = 'ResultIcon';

const ResultTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="result-title"
      className={cn('text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  ),
);
ResultTitle.displayName = 'ResultTitle';

const ResultDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="result-description"
    className={cn('text-muted-foreground max-w-md text-sm', className)}
    {...props}
  />
));
ResultDescription.displayName = 'ResultDescription';

const ResultContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="result-content" className={cn('w-full', className)} {...props} />
  ),
);
ResultContent.displayName = 'ResultContent';

const ResultActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="result-actions"
      className={cn('flex flex-wrap items-center justify-center gap-3 pt-2', className)}
      {...props}
    />
  ),
);
ResultActions.displayName = 'ResultActions';

const ResultExtra = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="result-extra"
      className={cn('text-muted-foreground w-full border-t pt-4 text-xs', className)}
      {...props}
    />
  ),
);
ResultExtra.displayName = 'ResultExtra';

export {
  Result,
  ResultActions,
  ResultContent,
  ResultDescription,
  ResultExtra,
  ResultIcon,
  resultIconVariants,
  ResultTitle,
  resultVariants,
};
