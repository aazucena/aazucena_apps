'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const briefVariants = cva('rounded-card border p-8 space-y-8', {
  variants: {
    variant: {
      default: 'bg-card border-border',
      glass: 'bg-background/5 dark:bg-state border-border/10 text-foreground',
      cyber: 'bg-background/80 dark:bg-panel border-signal/30 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Brief = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof briefVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(briefVariants({ variant }), className)} {...props} />
));
Brief.displayName = 'Brief';

const BriefHeader = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        'border-b border-current/10 pb-4 text-[10px] font-black tracking-[0.3em] uppercase opacity-40',
        className,
      )}
      {...props}
    />
  ),
);
BriefHeader.displayName = 'BriefHeader';

const BriefSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)} {...props} />
  ),
);
BriefSection.displayName = 'BriefSection';

const BriefItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  ),
);
BriefItem.displayName = 'BriefItem';

const BriefLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-[9px] font-black tracking-widest uppercase opacity-40', className)}
      {...props}
    />
  ),
);
BriefLabel.displayName = 'BriefLabel';

const BriefValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm font-bold opacity-90', className)} {...props} />
  ),
);
BriefValue.displayName = 'BriefValue';

const briefCalloutVariants = cva('p-5 rounded-card border flex items-start gap-4', {
  variants: {
    variant: {
      default: 'glass bg-signal-faint border-primary/20 text-primary',
      cyber: 'bg-signal/5 border-signal/20 text-signal',
      glass: 'glass text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BriefCallout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof briefCalloutVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(briefCalloutVariants({ variant }), className)} {...props} />
));
BriefCallout.displayName = 'BriefCallout';

export {
  Brief,
  BriefHeader,
  BriefSection,
  BriefItem,
  BriefLabel,
  BriefValue,
  BriefCallout,
  briefVariants,
  briefCalloutVariants,
};
