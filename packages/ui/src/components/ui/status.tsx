'use client';

/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

export const statusVariants = cva('inline-flex items-center gap-2 transition-all duration-300', {
  variants: {
    variant: {
      default: 'px-4 py-2 bg-muted/30 border border-border rounded-badge',
      pill: 'px-3 py-1.5 bg-background border border-border rounded-badge',
      ghost: 'bg-transparent border-none',
      cyber: 'font-mono text-[10px] tracking-widest',
      nominal: 'border-success/20 text-success bg-success/5 hover:bg-success/10',
      warning: 'border-warning/20 text-warning bg-warning/5 hover:bg-warning/10',
      critical: 'border-alert/20 text-alert bg-alert/5 hover:bg-alert/10',
      loading: 'border-signal/20 text-signal bg-signal/5 hover:bg-signal/10',
      neutral:
        'border-rule-strong/20 text-muted-foreground bg-rule-strong/5 hover:bg-rule-strong/10',
    },
    size: {
      default: '',
      sm: 'px-2 py-0.5 text-[9px]',
      lg: 'px-4 py-2 text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusVariants> {
  asChild?: boolean;
}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp ref={ref} className={cn(statusVariants({ variant, size }), className)} {...props} />
    );
  },
);
Status.displayName = 'Status';

export const statusDotVariants = cva('relative shrink-0 rounded-full transition-all duration-500', {
  variants: {
    state: {
      nominal: 'bg-success',
      warning: 'bg-warning',
      critical: 'bg-alert',
      loading: 'bg-signal',
      intel: 'bg-signal',
      success: 'bg-success',
      neutral: 'bg-rule-strong',
      primary: 'bg-signal',
      secondary: 'bg-secondary-500',
      OPERATIONAL: 'bg-success',
      DEGRADED: 'bg-warning',
      UNKNOWN: 'bg-rule-strong',
      LOADING: 'bg-signal',
    },
    size: {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      default: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    },
    pulse: {
      true: '',
      false: '',
    },
    animated: {
      true: 'animate-pulse',
      false: '',
    },
    interactive: {
      true: 'group-hover:scale-125 cursor-pointer',
      false: '',
    },
  },
  compoundVariants: [
    {
      pulse: true,
      className:
        'after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-current after:opacity-75',
    },
  ],
  defaultVariants: {
    state: 'nominal',
    size: 'sm',
    pulse: false,
    animated: false,
    interactive: false,
  },
});

export const StatusDot = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof statusDotVariants>
>(({ className, state, size, pulse, animated, interactive, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(statusDotVariants({ state, size, pulse, animated, interactive }), className)}
    {...props}
  />
));
StatusDot.displayName = 'StatusDot';

export const statusLabelVariants = cva('text-xs font-bold transition-colors', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      cyber: 'uppercase tracking-widest text-[9px] opacity-70',
      bright: 'text-foreground',
      compact: 'text-[10px] font-black uppercase tracking-[0.2em]',
    },
    state: {
      nominal: 'text-success',
      warning: 'text-warning',
      critical: 'text-alert',
      loading: 'text-signal',
      intel: 'text-signal',
      success: 'text-success',
      neutral: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const StatusLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof statusLabelVariants>
>(({ className, variant, state, ...props }, ref) => (
  <span ref={ref} className={cn(statusLabelVariants({ variant, state }), className)} {...props} />
));
StatusLabel.displayName = 'StatusLabel';

export * from './heartbeat';
