'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const environmentVariants = cva(
  'fixed inset-0 pointer-events-none transition-all duration-500 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'z-0',
        overlay: 'z-10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

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

const environmentGridVariants = cva('absolute inset-0 transition-all duration-1000 opacity-20', {
  variants: {
    variant: {
      default:
        'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]',
      cyber:
        'bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:40px_40px]',
      dots: 'bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:16px_16px]',
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

const environmentGlowVariants = cva(
  'absolute rounded-full blur-[120px] transition-all duration-1000 animate-pulse',
  {
    variants: {
      color: {
        blue: 'bg-blue-500/10 dark:bg-blue-600/5',
        purple: 'bg-purple-500/10 dark:bg-purple-600/5',
        cyan: 'bg-cyan-500/10 dark:bg-cyan-600/5',
        rose: 'bg-rose-500/10 dark:bg-rose-600/5',
        indigo: 'bg-indigo-500/10 dark:bg-indigo-600/5',
        orange: 'bg-orange-500/10 dark:bg-orange-600/5',
        red: 'bg-red-500/10 dark:bg-red-600/5',
        emerald: 'bg-emerald-500/10 dark:bg-emerald-600/5',
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
  },
);

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

const environmentAtmosphereVariants = cva('absolute inset-0 transition-all duration-1000', {
  variants: {
    phase: {
      exosphere: 'bg-gradient-to-b from-black via-slate-900 to-blue-900/20',
      thermosphere: 'bg-gradient-to-b from-blue-900/40 via-blue-800/30 to-blue-700/20',
      mesosphere: 'bg-gradient-to-b from-blue-700/30 via-blue-600/20 to-blue-500/10',
      stratosphere: 'bg-gradient-to-b from-blue-500/20 via-blue-400/10 to-blue-300/5',
      troposphere: 'bg-gradient-to-b from-blue-300/10 via-blue-100/5 to-white dark:to-gray-950',
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
