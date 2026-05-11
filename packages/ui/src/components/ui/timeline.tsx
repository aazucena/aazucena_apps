'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const timelineVariants = cva('relative w-full transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-foreground dark:text-cyan-50',
      alternating: 'max-w-5xl mx-auto',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof timelineVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(timelineVariants({ variant }), className)} {...props} />
));
Timeline.displayName = 'Timeline';

const timelineItemVariants = cva('group relative pb-8 last:pb-0 md:pb-12 flex flex-col', {
  variants: {
    side: {
      left: 'md:flex-row md:items-center',
      right: 'md:flex-row-reverse md:items-center',
      default: '',
    },
  },
  defaultVariants: {
    side: 'default',
  },
});

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof timelineItemVariants>
>(({ className, side, ...props }, ref) => (
  <div ref={ref} className={cn(timelineItemVariants({ side }), className)} {...props} />
));
TimelineItem.displayName = 'TimelineItem';

const timelineDotVariants = cva(
  'flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-white/40 dark:to-white/20',
        primary: 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-400/50',
        success: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-400/50',
        warning: 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-400/50',
        danger: 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-400/50',
        cyber:
          'bg-zinc-100 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:bg-black dark:shadow-[0_0_10px_rgba(6,182,212,0.5)]',
      },
      position: {
        left: 'absolute top-1/2 left-0 -translate-y-1/2 z-10',
        center: 'absolute top-1/2 left-0 md:left-1/2 -translate-y-1/2 md:-translate-x-1/2 z-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'left',
    },
  },
);

export interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof timelineDotVariants> {}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, position, ...props }, ref) => {
    return (
      <div className={cn(timelineDotVariants({ variant, position }), className)}>
        <div
          ref={ref}
          className={cn(
            'h-3 w-3 rounded-full bg-zinc-400 transition-all duration-300 dark:bg-white/80',
            variant === 'cyber' && 'animate-pulse bg-cyan-600 dark:bg-cyan-400',
          )}
          {...props}
        />
      </div>
    );
  },
);
TimelineDot.displayName = 'TimelineDot';

const timelineLineVariants = cva('absolute h-full w-0.5 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-gradient-to-b from-cyan-400/50 via-cyan-400/30 to-transparent',
      cyber:
        'bg-gradient-to-b from-cyan-500/80 via-cyan-500/40 to-transparent shadow-[0_0:8px_rgba(6,182,212,0.3)]',
    },
    position: {
      left: 'top-1/2 left-[11px]',
      center: 'top-1/2 left-[11px] md:left-1/2 md:-translate-x-1/2',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'left',
  },
});

const TimelineLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof timelineLineVariants>
>(({ className, variant, position, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(timelineLineVariants({ variant, position }), className)}
    {...props}
  />
));
TimelineLine.displayName = 'TimelineLine';

const timelineContentVariants = cva('transition-all duration-500', {
  variants: {
    side: {
      left: 'w-full md:w-1/2 ml-8 md:ml-0 md:mr-auto md:pr-16',
      right: 'w-full md:w-1/2 ml-8 md:ml-0 md:ml-auto md:pl-16',
      default: 'ml-12 md:ml-16 min-w-0',
    },
  },
  defaultVariants: {
    side: 'default',
  },
});

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof timelineContentVariants>
>(({ className, side, ...props }, ref) => (
  <div ref={ref} className={cn(timelineContentVariants({ side }), className)} {...props} />
));
TimelineContent.displayName = 'TimelineContent';

const TimelineHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-3 flex flex-col gap-1', className)} {...props} />
  ),
);
TimelineHeader.displayName = 'TimelineHeader';

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-foreground text-2xl font-bold', className)} {...props}>
    {children || 'Item'}
  </h3>
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm leading-relaxed opacity-60', className)} {...props} />
));
TimelineDescription.displayName = 'TimelineDescription';

const TimelineBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-muted text-muted-foreground border-border mb-6 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase',
        className,
      )}
      {...props}
    />
  ),
);
TimelineBadge.displayName = 'TimelineBadge';

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineLine,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineBadge,
};
