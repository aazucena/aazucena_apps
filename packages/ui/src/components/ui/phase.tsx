'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const phaseVariants = cva('py-24 transition-all duration-500', {
  variants: {
    variant: {
      default: 'bg-panel dark:bg-background',
      alternate: 'bg-panel/50 dark:bg-panel/30 border-y border-rule',
      cyber: 'bg-background/40 dark:bg-scrim border-y border-signal/10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Phase = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & VariantProps<typeof phaseVariants>
>(({ className, variant, ...props }, ref) => (
  <section ref={ref} className={cn(phaseVariants({ variant }), className)} {...props} />
));
Phase.displayName = 'Phase';

const PhaseHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto mb-16 max-w-5xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  ),
);
PhaseHeader.displayName = 'PhaseHeader';

const phaseBadgeVariants = cva(
  'inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-8 transition-all duration-300',
  {
    variants: {
      variant: {
        blue: 'bg-signal-faint dark:bg-panel-raised/20 border-signal dark:border-rule text-signal',
        purple:
          'bg-series-3/10 dark:bg-panel-raised/20 border-series-3 dark:border-rule text-series-3',
        green: 'bg-success/10 dark:bg-panel-raised/20 border-success dark:border-rule text-success',
        cyber:
          'glass bg-signal-faint dark:bg-signal/5 border-border dark:border-signal/20 text-primary dark:text-signal',
      },
    },
    defaultVariants: {
      variant: 'blue',
    },
  },
);

const PhaseBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof phaseBadgeVariants>
>(({ className, variant, children, ...props }, ref) => (
  <div ref={ref} className={cn(phaseBadgeVariants({ variant }), className)} {...props}>
    <div
      className={cn(
        'h-1.5 w-1.5 animate-pulse rounded-full',
        variant === 'blue'
          ? 'bg-signal'
          : variant === 'purple'
            ? 'bg-series-3'
            : variant === 'green'
              ? 'bg-success'
              : 'bg-signal',
      )}
    />
    <span className="text-[10px] font-black tracking-[0.3em] uppercase">{children}</span>
  </div>
));
PhaseBadge.displayName = 'PhaseBadge';

const PhaseTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'text-foreground mb-6 text-4xl font-black tracking-tighter md:text-6xl',
        className,
      )}
      {...props}
    />
  ),
);
PhaseTitle.displayName = 'PhaseTitle';

const PhaseDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground max-w-3xl text-xl leading-relaxed font-medium', className)}
    {...props}
  />
));
PhaseDescription.displayName = 'PhaseDescription';

const PhaseContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full transition-all duration-500', className)} {...props} />
  ),
);
PhaseContent.displayName = 'PhaseContent';

export {
  Phase,
  PhaseHeader,
  PhaseBadge,
  PhaseTitle,
  PhaseDescription,
  PhaseContent,
  phaseVariants,
  phaseBadgeVariants,
};
