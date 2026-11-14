'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const spotlightVariants = cva(
  'group relative rounded-card border transition-colors duration-(--motion-base) overflow-hidden flex flex-col md:flex-row gap-8 items-start',
  {
    variants: {
      variant: {
        default: 'bg-panel/50 dark:bg-panel/30 border-rule hover:border-primary/20 p-10',
        glass:
          'bg-background/5 dark:bg-state border-border/10 text-foreground hover:bg-background/10 p-10',
        cyber:
          'bg-background/40 dark:bg-panel border-signal/20 text-foreground hover:border-signal p-10',
        // Gradient variants absorbed from FeaturedCard
        'cyan-blue': 'border-signal/30 text-foreground p-10',
        'emerald-teal': 'border-success/30 text-foreground p-10',
        'purple-pink': 'border-series-3/30 text-foreground p-10',
        'orange-red': 'border-warning/30 text-foreground p-10',
        'indigo-purple': 'border-series-3/30 text-foreground p-10',
      },
      size: {
        default: 'p-8 md:p-10',
        lg: 'p-10 md:p-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Spotlight = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof spotlightVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(spotlightVariants({ variant, size }), className)} {...props} />
));
Spotlight.displayName = 'Spotlight';

const spotlightVisualVariants = cva(
  'flex-shrink-0 transition-transform duration-(--motion-base) group-hover:scale-110',
  {
    variants: {
      variant: {
        default:
          'w-14 h-14 rounded-card flex items-center justify-center bg-primary/10 text-primary',
        glass:
          'w-14 h-14 rounded-card flex items-center justify-center bg-background/10 dark:bg-state text-foreground border border-border/20',
        cyber:
          'w-14 h-14 rounded-card flex items-center justify-center bg-primary/10 dark:bg-signal/10 text-primary dark:text-signal border border-border/10 dark:border-signal/30',
        // Gradient matches for icon boxes
        'cyan-blue': 'w-14 h-14 rounded-card flex items-center justify-center text-foreground',
        'emerald-teal': 'w-14 h-14 rounded-card flex items-center justify-center text-foreground',
        'purple-pink': 'w-14 h-14 rounded-card flex items-center justify-center text-foreground',
        'orange-red': 'w-14 h-14 rounded-card flex items-center justify-center text-foreground',
        'indigo-purple': 'w-14 h-14 rounded-card flex items-center justify-center text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const SpotlightVisual = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof spotlightVisualVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(spotlightVisualVariants({ variant }), className)} {...props} />
));
SpotlightVisual.displayName = 'SpotlightVisual';

const SpotlightContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 space-y-4', className)} {...props} />
  ),
);
SpotlightContent.displayName = 'SpotlightContent';

const spotlightTitleVariants = cva('text-2xl font-black tracking-tight transition-colors', {
  variants: {
    variant: {
      default: 'text-foreground group-hover:text-primary',
      glass: 'text-foreground group-hover:text-signal',
      cyber: 'text-foreground group-hover:text-signal',
      'cyan-blue': 'text-foreground',
      'emerald-teal': 'text-foreground',
      'purple-pink': 'text-foreground',
      'orange-red': 'text-foreground',
      'indigo-purple': 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const SpotlightTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & VariantProps<typeof spotlightTitleVariants>
>(({ className, variant, ...props }, ref) => (
  <h3 ref={ref} className={cn(spotlightTitleVariants({ variant }), className)} {...props} />
));
SpotlightTitle.displayName = 'SpotlightTitle';

const SpotlightDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-base leading-relaxed font-medium opacity-70', className)}
    {...props}
  />
));
SpotlightDescription.displayName = 'SpotlightDescription';

const SpotlightMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  ),
);
SpotlightMeta.displayName = 'SpotlightMeta';

export {
  Spotlight,
  SpotlightVisual,
  SpotlightContent,
  SpotlightTitle,
  SpotlightDescription,
  SpotlightMeta,
  spotlightVariants,
  spotlightVisualVariants,
  spotlightTitleVariants,
};
