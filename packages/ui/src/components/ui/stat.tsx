'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

export const statVariants = cva('flex flex-col transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      card: 'bg-card border border-border p-6 rounded-card',
      glass:
        'bg-background/5 dark:bg-state border border-border/10 text-foreground p-6 rounded-card',
      cyber:
        'bg-background/80 dark:bg-scrim border border-signal/30 text-foreground p-6 rounded-card',
    },
    alignment: {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    },
  },
  defaultVariants: {
    variant: 'default',
    alignment: 'left',
  },
});

export const Stat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statVariants>
>(({ className, variant, alignment, ...props }, ref) => (
  <div ref={ref} className={cn(statVariants({ variant, alignment }), className)} {...props} />
));
Stat.displayName = 'Stat';

export const statValueVariants = cva('font-black tracking-tighter transition-all duration-300', {
  variants: {
    variant: {
      default: 'text-foreground',
      glass: 'text-foreground',
      cyber: 'text-signal font-mono',
      primary: 'text-signal',
      secondary: 'text-signal',
      success: 'text-signal',
      rose: 'text-signal',
    },
    size: {
      sm: 'text-2xl',
      default: 'text-3xl',
      lg: 'text-4xl md:text-5xl',
      xl: 'text-5xl md:text-7xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const StatValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statValueVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(statValueVariants({ variant, size }), className)} {...props} />
));
StatValue.displayName = 'StatValue';

export const statLabelVariants = cva('transition-all duration-300', {
  variants: {
    variant: {
      default:
        'text-[10px] font-black uppercase tracking-[0.2em] text-foreground0 dark:text-muted-foreground mb-1',
      glass: 'text-sm text-foreground/60 font-medium',
      cyber: 'text-foreground0/60 font-mono uppercase tracking-wider text-[10px] font-black',
      bright: 'text-lg font-bold opacity-90 tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const StatLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statLabelVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(statLabelVariants({ variant }), className)} {...props} />
));
StatLabel.displayName = 'StatLabel';

export const statDescriptionVariants = cva(
  'text-[10px] font-mono uppercase transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground',
        primary: 'text-signal/70',
        secondary: 'text-secondary-500/70',
        success: 'text-success/70',
        rose: 'text-alert/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const StatDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & VariantProps<typeof statDescriptionVariants>
>(({ className, variant, ...props }, ref) => (
  <p ref={ref} className={cn(statDescriptionVariants({ variant }), className)} {...props} />
));
StatDescription.displayName = 'StatDescription';

export const statIconVariants = cva(
  'transition-all duration-500 group-hover:scale-110 flex items-center justify-center rounded-card',
  {
    variants: {
      variant: {
        default:
          'bg-panel dark:bg-panel-raised text-muted-foreground dark:text-foreground group-hover:text-signal/50',
        glass: 'bg-background/10 dark:bg-state text-foreground border border-border/20',
        cyber:
          'bg-primary/20 dark:bg-signal/20 text-primary dark:text-signal border border-border/10 dark:border-signal/40',
        primary: 'bg-signal/10 border border-signal/20 text-signal',
        secondary: 'bg-secondary-500/10 border border-secondary-500/20 text-secondary-500',
        success: 'bg-success/10 border border-success/20 text-success',
        rose: 'bg-alert/10 border border-alert/20 text-alert',
      },
      size: {
        default: 'h-12 w-12',
        sm: 'h-10 w-10',
        lg: 'h-14 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const StatIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statIconVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(statIconVariants({ variant, size }), className)} {...props} />
));
StatIcon.displayName = 'StatIcon';

export * from './stat-board';
