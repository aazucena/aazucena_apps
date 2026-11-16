import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@aazucena/utils';

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

/**
 * ChartContainer
 * Root wrapper with cinematic terminal aesthetic.
 */
export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          'group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-card,6px)] bg-(--panel) text-(--foreground)',
          className,
        )}
        {...props}
      />
    );
  },
);
ChartContainer.displayName = 'ChartContainer';

/**
 * ChartHeader
 * Top section for title and toolbar.
 */
export const ChartHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-h-(--panel-header) items-center justify-between gap-3 border-b border-(--rule) px-(--panel-padding) py-2',
        className,
      )}
      {...props}
    />
  ),
);
ChartHeader.displayName = 'ChartHeader';

/**
 * ChartTitle
 */
export const ChartTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-mono text-[10px] leading-[14px] font-normal tracking-[0.2em] uppercase text-(--muted-foreground)',
      className,
    )}
    {...props}
  />
));
ChartTitle.displayName = 'ChartTitle';

/**
 * ChartDescription
 */
export const ChartDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-(--muted-foreground)', className)} {...props} />
));
ChartDescription.displayName = 'ChartDescription';

/**
 * ChartContent
 * Main visualization area.
 */
export const ChartContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative min-h-0 w-full flex-1 p-(--panel-padding)', className)}
      {...props}
    />
  ),
);
ChartContent.displayName = 'ChartContent';

/**
 * ChartFooter
 * Bottom section for legends or metadata.
 */
export const ChartFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-(--rule) px-(--panel-padding) py-3', className)}
      {...props}
    />
  ),
);
ChartFooter.displayName = 'ChartFooter';
