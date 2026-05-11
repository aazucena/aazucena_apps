'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const spotlightVariants = cva(
  'group relative rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col md:flex-row gap-8 items-start',
  {
    variants: {
      variant: {
        default:
          'bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 hover:border-primary/20 p-10',
        glass:
          'bg-background/5 dark:bg-white/5 backdrop-blur-md border-border/10 text-foreground hover:bg-background/10 dark:bg-white/10 p-10 shadow-xl',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/20 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:border-cyan-400 p-10',
        // Gradient variants absorbed from FeaturedCard
        'cyan-blue':
          'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-400/20 hover:to-blue-500/20 border-cyan-400/30 text-foreground dark:text-white p-10',
        'emerald-teal':
          'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-400/20 hover:to-teal-500/20 border-emerald-400/30 text-foreground dark:text-white p-10',
        'purple-pink':
          'bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-400/20 hover:to-pink-500/20 border-purple-400/30 text-foreground dark:text-white p-10',
        'orange-red':
          'bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-400/20 hover:to-red-500/20 border-orange-400/30 text-foreground dark:text-white p-10',
        'indigo-purple':
          'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-400/20 hover:to-purple-500/20 border-indigo-400/30 text-foreground dark:text-white p-10',
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
  'flex-shrink-0 transition-all duration-500 group-hover:scale-110',
  {
    variants: {
      variant: {
        default:
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 text-primary',
        glass:
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-background/10 dark:bg-white/10 text-foreground border border-border/20',
        cyber:
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-400 border border-border/10 dark:border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
        // Gradient matches for icon boxes
        'cyan-blue':
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-foreground shadow-lg shadow-cyan-400/20',
        'emerald-teal':
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-foreground shadow-lg shadow-emerald-400/20',
        'purple-pink':
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 text-foreground shadow-lg shadow-purple-400/20',
        'orange-red':
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-foreground shadow-lg shadow-orange-400/20',
        'indigo-purple':
          'w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-foreground shadow-lg shadow-indigo-400/20',
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
      glass: 'text-foreground group-hover:text-cyan-400',
      cyber: 'text-foreground group-hover:text-cyan-400',
      'cyan-blue': 'text-foreground dark:text-white',
      'emerald-teal': 'text-foreground dark:text-white',
      'purple-pink': 'text-foreground dark:text-white',
      'orange-red': 'text-foreground dark:text-white',
      'indigo-purple': 'text-foreground dark:text-white',
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
