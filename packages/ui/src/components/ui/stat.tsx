'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

export const statVariants = cva('flex flex-col transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      card: 'bg-card border border-border shadow-sm p-6 rounded-2xl',
      glass:
        'bg-background/5 dark:bg-white/5 backdrop-blur-md border border-border/10 text-foreground shadow-xl p-6 rounded-2xl',
      cyber:
        'bg-background/80 dark:bg-black/80 border border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 rounded-2xl',
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
      cyber: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] font-mono',
      primary:
        'bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200',
      secondary:
        'bg-clip-text text-transparent bg-gradient-to-br from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-200',
      success:
        'bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200',
      rose: 'bg-clip-text text-transparent bg-gradient-to-br from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-200',
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
        'text-[10px] font-black uppercase tracking-[0.2em] text-foreground0 dark:text-zinc-400 mb-1',
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
        default: 'text-zinc-400 dark:text-zinc-600',
        primary: 'text-primary-500/70',
        secondary: 'text-secondary-500/70',
        success: 'text-emerald-500/70',
        rose: 'text-rose-500/70',
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
  'transition-all duration-500 group-hover:scale-110 flex items-center justify-center rounded-2xl',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-800 group-hover:text-primary-500/50',
        glass: 'bg-background/10 dark:bg-white/10 text-foreground border border-border/20',
        cyber:
          'bg-primary/20 dark:bg-cyan-500/20 text-primary dark:text-cyan-400 border border-border/10 dark:border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
        primary: 'bg-primary-500/10 border border-primary-500/20 text-primary-500',
        secondary: 'bg-secondary-500/10 border border-secondary-500/20 text-secondary-500',
        success: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500',
        rose: 'bg-rose-500/10 border border-rose-500/20 text-rose-500',
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
