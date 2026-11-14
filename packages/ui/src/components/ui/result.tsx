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
  'flex flex-col items-center justify-center text-center rounded-card border p-8 md:p-12 transition-colors duration-(--motion-base)',
  {
    variants: {
      variant: {
        default: 'bg-background',
        glass: 'bg-background/5 dark:bg-state border-border/10',
        cyber: 'bg-background border-signal/30',
      },
      status: {
        success: 'border-success/30',
        info: 'border-signal/30',
        warning: 'border-warning/30',
        error: 'border-alert/30',
      },
      size: {
        sm: 'p-6 max-w-sm gap-3',
        default: 'p-8 md:p-12 max-w-lg gap-4',
        lg: 'p-12 md:p-16 max-w-2xl gap-5',
      },
    },
    compoundVariants: [
      { variant: 'cyber', status: 'success', className: 'border-signal/30' },
      { variant: 'cyber', status: 'info', className: 'border-signal/30' },
      { variant: 'cyber', status: 'warning', className: 'border-signal/30' },
      { variant: 'cyber', status: 'error', className: 'border-signal/30' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/* ─── CVA: ResultIcon ──────────────────────────────────────────────────────── */

const resultIconVariants = cva(
  'relative flex shrink-0 items-center justify-center rounded-full ring-4 transition-colors duration-(--motion-base)',
  {
    variants: {
      status: {
        success: 'bg-success/10 text-success ring-success/20 dark:bg-panel-raised/50',
        info: 'bg-signal-faint text-signal ring-signal/20 dark:bg-panel-raised/50',
        warning: 'bg-warning/10 text-warning ring-warning/20 dark:bg-panel-raised/50',
        error: 'bg-alert/10 text-alert ring-alert/20 dark:bg-panel-raised/50',
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
