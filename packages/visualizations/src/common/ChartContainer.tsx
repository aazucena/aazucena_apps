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
          'group relative flex flex-col w-full bg-accent/5 rounded-[2rem] border border-border/50 overflow-hidden transition-all hover:bg-accent/10 hover:border-border',
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
        'flex items-center justify-between px-6 py-4 border-b border-border/10',
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
    className={cn('text-sm font-bold tracking-tight uppercase', className)}
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
  <p
    ref={ref}
    className={cn('text-[10px] text-muted-foreground font-medium', className)}
    {...props}
  />
));
ChartDescription.displayName = 'ChartDescription';

/**
 * ChartContent
 * Main visualization area.
 */
export const ChartContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex-1 min-h-0 w-full p-4', className)} {...props} />
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
      className={cn('px-6 py-4 border-t border-border/10 bg-accent/5', className)}
      {...props}
    />
  ),
);
ChartFooter.displayName = 'ChartFooter';
