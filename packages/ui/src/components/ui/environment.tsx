'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const environmentVariants = cva('fixed inset-0 pointer-events-none overflow-hidden', {
  variants: {
    variant: {
      default: 'z-0',
      overlay: 'z-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Environment = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof environmentVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(environmentVariants({ variant }), className)} {...props} />
));
Environment.displayName = 'Environment';

const EnvironmentShell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative flex min-h-screen flex-col', className)} {...props} />
  ),
);
EnvironmentShell.displayName = 'EnvironmentShell';

const EnvironmentHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative z-20', className)} {...props} />
  ),
);
EnvironmentHeader.displayName = 'EnvironmentHeader';

const EnvironmentMain = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('relative z-10 flex-1', className)} {...props} />
  ),
);
EnvironmentMain.displayName = 'EnvironmentMain';

const EnvironmentFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative z-20', className)} {...props} />
  ),
);
EnvironmentFooter.displayName = 'EnvironmentFooter';

const environmentGridVariants = cva('absolute inset-0 opacity-20', {
  variants: {
    variant: {
      default:
        'bg-[linear-gradient(to_right,var(--chart-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--chart-grid)_1px,transparent_1px)] bg-[size:24px_24px]',
      cyber:
        'bg-[linear-gradient(to_right,var(--signal-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--signal-line)_1px,transparent_1px)] bg-[size:40px_40px]',
      dots: 'bg-[radial-gradient(var(--chart-grid)_1px,transparent_1px)] [background-size:16px_16px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const EnvironmentGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof environmentGridVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(environmentGridVariants({ variant }), className)} {...props} />
));
EnvironmentGrid.displayName = 'EnvironmentGrid';

const environmentGlowVariants = cva('absolute rounded-full blur-[120px] animate-pulse', {
  variants: {
    color: {
      blue: 'bg-signal/10 dark:bg-signal/5',
      purple: 'bg-series-3/10 dark:bg-series-3/5',
      cyan: 'bg-signal/10 dark:bg-signal/5',
      rose: 'bg-alert/10 dark:bg-alert/5',
      indigo: 'bg-series-3/10 dark:bg-series-3/5',
      orange: 'bg-warning/10 dark:bg-warning/5',
      red: 'bg-alert/10 dark:bg-alert/5',
      emerald: 'bg-success/10 dark:bg-success/5',
    },
    size: {
      xs: 'w-1/6 h-1/4',
      sm: 'w-1/4 h-1/4',
      md: 'w-1/2 h-1/2',
      lg: 'w-[70%] h-[70%]',
      xl: 'w-[90%] h-[90%]',
    },
    position: {
      'top-left': '-top-[10%] -left-[10%]',
      'top-right': '-top-[10%] -right-[10%]',
      'bottom-left': '-bottom-[10%] -left-[10%]',
      'bottom-right': '-bottom-[10%] -right-[10%]',
      center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
  },
  defaultVariants: {
    color: 'blue',
    size: 'md',
    position: 'top-left',
  },
});

const EnvironmentGlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof environmentGlowVariants> & { delay?: string }
>(({ className, color, size, position, delay, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(environmentGlowVariants({ color, size, position }), className)}
    style={{ animationDelay: delay, ...style }}
    {...props}
  />
));
EnvironmentGlow.displayName = 'EnvironmentGlow';

const environmentAtmosphereVariants = cva('absolute inset-0 transition-colors duration-1000', {
  variants: {
    phase: {
      exosphere: 'bg-linear-to-b from-background via-panel to-signal-faint',
      thermosphere: 'bg-linear-to-b from-signal-faint to-signal-subtle',
      mesosphere: 'bg-linear-to-b from-signal-subtle to-signal-faint',
      stratosphere: 'bg-linear-to-b from-signal-faint to-background',
      troposphere: 'bg-linear-to-b from-background to-panel',
    },
  },
  defaultVariants: {
    phase: 'exosphere',
  },
});

const EnvironmentAtmosphere = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof environmentAtmosphereVariants>
>(({ className, phase, ...props }, ref) => (
  <div ref={ref} className={cn(environmentAtmosphereVariants({ phase }), className)} {...props} />
));
EnvironmentAtmosphere.displayName = 'EnvironmentAtmosphere';

const EnvironmentNoise = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay',
        className,
      )}
      style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      {...props}
    />
  ),
);
EnvironmentNoise.displayName = 'EnvironmentNoise';

export {
  Environment,
  EnvironmentShell,
  EnvironmentHeader,
  EnvironmentMain,
  EnvironmentFooter,
  EnvironmentGrid,
  EnvironmentGlow,
  EnvironmentAtmosphere,
  EnvironmentNoise,
  environmentVariants,
  environmentGridVariants,
  environmentGlowVariants,
  environmentAtmosphereVariants,
};
