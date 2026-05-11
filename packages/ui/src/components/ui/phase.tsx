'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const phaseVariants = cva('py-24 transition-all duration-500', {
  variants: {
    variant: {
      default: 'bg-white dark:bg-gray-950',
      alternate: 'bg-gray-50/50 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800',
      cyber: 'bg-background/40 dark:bg-black/40 border-y border-cyan-500/10',
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
        blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400',
        purple:
          'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400',
        green:
          'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400',
        cyber:
          'glass bg-primary-100 dark:bg-cyan-500/5 border-border dark:border-cyan-500/20 text-primary dark:text-cyan-400',
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
          ? 'bg-blue-500'
          : variant === 'purple'
            ? 'bg-purple-500'
            : variant === 'green'
              ? 'bg-emerald-500'
              : 'bg-cyan-400',
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
        'mb-6 text-4xl font-black tracking-tighter text-gray-900 md:text-6xl dark:text-white',
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
    className={cn(
      'max-w-3xl text-xl leading-relaxed font-medium text-gray-600 dark:text-gray-400',
      className,
    )}
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
