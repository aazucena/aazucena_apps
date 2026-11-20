import * as React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative w-full', className)} {...props} />
  ),
);
Timeline.displayName = 'Timeline';

const TimelineItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative pb-8 md:pb-12 last:pb-0 group', className)} {...props} />
  ),
);
TimelineItem.displayName = 'TimelineItem';

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-muted-foreground',
    primary: 'bg-signal',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-alert',
  };

  return (
    <div className="absolute left-0 top-8 -translate-y-1/2 flex items-center justify-center z-10">
      <div
        ref={ref}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className="h-3 w-3 rounded-full bg-background" />
      </div>
    </div>
  );
});
TimelineDot.displayName = 'TimelineDot';

const TimelineLine = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('absolute left-[11px] top-8 h-full w-px bg-rule', className)}
      {...props}
    />
  ),
);
TimelineLine.displayName = 'TimelineLine';

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ml-12 md:ml-16', className)} {...props} />
  ),
);
TimelineContent.displayName = 'TimelineContent';

const TimelineHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 mb-3', className)} {...props} />
  ),
);
TimelineHeader.displayName = 'TimelineHeader';

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-2xl font-bold text-foreground', className)} {...props} />
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
TimelineDescription.displayName = 'TimelineDescription';

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
};
