'use client';

/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Progress } from './progress';

export const dataListVariants = cva('w-full transition-all duration-500 overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-card border border-border rounded-[2rem]',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 rounded-[2rem] text-foreground shadow-xl',
      cyber:
        'bg-background/40 dark:bg-black/40 border border-cyan-500/20 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-xl',
      transparent: 'bg-transparent border-none p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const DataList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dataListVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(dataListVariants({ variant }), className)} {...props} />
));
DataList.displayName = 'DataList';

export const DataListHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between border-b border-current/10 bg-current/5 px-8 py-6',
      className,
    )}
    {...props}
  />
));
DataListHeader.displayName = 'DataListHeader';

export const DataListTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-0.5 text-sm leading-tight font-bold', className)} {...props} />
  ),
);
DataListTitle.displayName = 'DataListTitle';

export const DataListSubtitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-[10px] font-black tracking-widest uppercase opacity-40', className)}
    {...props}
  />
));
DataListSubtitle.displayName = 'DataListSubtitle';

export const DataListProgress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Progress> & { label?: string; value: number }
>(({ className, label, value, ...props }, ref) => (
  <div className={cn('flex flex-col items-end gap-1.5', className)}>
    {label && <span className="font-mono text-[10px] font-bold opacity-60">{label}</span>}
    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-current/10">
      <Progress ref={ref} value={value} className="h-full bg-current" {...props} />
    </div>
  </div>
));
DataListProgress.displayName = 'DataListProgress';

export * from './data-list-table';
export * from './data-list-grid';
