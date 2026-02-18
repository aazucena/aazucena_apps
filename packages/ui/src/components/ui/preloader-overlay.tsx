'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Preloader Structural Components
 */

export const preloaderOverlayVariants = cva(
  'fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500',
  {
    variants: {
      theme: {
        default: 'bg-background',
        glass: 'bg-background/20 backdrop-blur-2xl',
        cyber: 'bg-black',
        hoyoverse: 'bg-[#f0f0f0] dark:bg-[#101010]',
        minimal: 'bg-white dark:bg-black',
        nature: 'bg-emerald-50 dark:bg-emerald-950',
      },
    },
    defaultVariants: {
      theme: 'default',
    },
  },
);

export const PreloaderOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof preloaderOverlayVariants>
>(({ className, theme, ...props }, ref) => (
  <div ref={ref} className={cn(preloaderOverlayVariants({ theme }), className)} {...props} />
));
PreloaderOverlay.displayName = 'PreloaderOverlay';

export const preloaderContentVariants = cva(
  'w-full max-w-md transition-all duration-500 flex flex-col gap-6',
  {
    variants: {
      variant: {
        default: '',
        card: 'bg-card border border-border rounded-[2rem] p-8 shadow-2xl',
        glass:
          'bg-background/5 dark:bg-white/5 backdrop-blur-xl border border-border/10 rounded-[2rem] p-8 shadow-2xl text-foreground',
        cyber:
          'bg-background/80 dark:bg-black/80 border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_30px_rgba(6,182,212,0.2)] text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const PreloaderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof preloaderContentVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(preloaderContentVariants({ variant }), className)} {...props} />
));
PreloaderContent.displayName = 'PreloaderContent';

export const PreloaderHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col items-center gap-4 text-center', className)}
    {...props}
  />
));
PreloaderHeader.displayName = 'PreloaderHeader';

export const PreloaderFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col items-center gap-4 pt-2', className)} {...props} />
));
PreloaderFooter.displayName = 'PreloaderFooter';

export const PreloaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex w-full items-center justify-center gap-3', className)}
    {...props}
  />
));
PreloaderActions.displayName = 'PreloaderActions';
