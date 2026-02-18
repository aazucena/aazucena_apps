'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const appLoaderVariants = cva(
  'fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-1000 text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background',
        glass: 'bg-background/40 backdrop-blur-3xl',
        cyber: 'bg-background dark:bg-black',
      },
      isHidden: {
        true: 'opacity-0 pointer-events-none scale-105',
        false: 'opacity-100 scale-100',
      },
    },
    defaultVariants: {
      variant: 'default',
      isHidden: false,
    },
  },
);

const AppLoader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof appLoaderVariants>
>(({ className, variant, isHidden, ...props }, ref) => (
  <div ref={ref} className={cn(appLoaderVariants({ variant, isHidden }), className)} {...props} />
));
AppLoader.displayName = 'AppLoader';

const appLoaderIconVariants = cva('transition-all duration-1000', {
  variants: {
    animation: {
      pulse: 'animate-pulse',
      'cyber-pulse': 'animate-cyber-pulse',
      spin: 'animate-[spin_10s_linear_infinite]',
      glitch: 'animate-[glitch_0.3s_ease-in-out_infinite] [@keyframes_glitch]:[0%_=>_translate(0)][20%_=>_translate(-2px,2px)][40%_=>_translate(-2px,-2px)][60%_=>_translate(2px,2px)][80%_=>_translate(2px,-2px)][100%_=>_translate(0)]',
      none: '',
    },
    size: {
      sm: 'w-24 h-24',
      md: 'w-48 h-48',
      lg: 'w-64 h-64',
      xl: 'w-[270px] h-[270px]',
    },
  },
  defaultVariants: {
    animation: 'pulse',
    size: 'xl',
  },
});

const AppLoaderIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof appLoaderIconVariants>
>(({ className, animation, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(appLoaderIconVariants({ animation, size }), 'flex items-center justify-center', className)}
    {...props}
  />
));
AppLoaderIcon.displayName = 'AppLoaderIcon';

const AppLoaderContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 flex flex-col items-center gap-8', className)}
      {...props}
    />
  ),
);
AppLoaderContent.displayName = 'AppLoaderContent';

const AppLoaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'animate-in fade-in slide-in-from-bottom-4 text-[10px] font-black tracking-[0.5em] uppercase opacity-40 duration-1000',
      className,
    )}
    {...props}
  />
));
AppLoaderTitle.displayName = 'AppLoaderTitle';

const AppLoaderStatus = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-[9px] font-mono tracking-widest uppercase opacity-30 animate-pulse',
      className,
    )}
    {...props}
  />
));
AppLoaderStatus.displayName = 'AppLoaderStatus';

const appLoaderProgressVariants = cva(
  'h-0.5 w-48 overflow-hidden rounded-full bg-current/10',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        primary: 'text-primary',
        cyan: 'text-cyan-500',
        destructive: 'text-destructive',
      }
    },
    defaultVariants: {
      variant: 'default',
    }
  }
);

const AppLoaderProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof appLoaderProgressVariants> & { 
    value?: number;
    showPercentage?: boolean;
  }
>(({ className, value, variant, showPercentage, ...props }, ref) => (
  <div className="flex flex-col items-center gap-2">
    <div
      ref={ref}
      className={cn(appLoaderProgressVariants({ variant }), className)}
      {...props}
    >
      <div
        className="h-full bg-current transition-all duration-500 ease-out"
        style={{ width: `${value || 0}%` }}
      />
    </div>
    {showPercentage && (
      <span className="text-[10px] font-mono opacity-40 tracking-tighter">
        {Math.round(value || 0)}%
      </span>
    )}
  </div>
));
AppLoaderProgress.displayName = 'AppLoaderProgress';

export {
  AppLoader,
  AppLoaderIcon,
  AppLoaderContent,
  AppLoaderTitle,
  AppLoaderStatus,
  AppLoaderProgress,
  appLoaderVariants,
  appLoaderIconVariants,
};
