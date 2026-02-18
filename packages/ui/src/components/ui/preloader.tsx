'use client';

/** @shadcn standard component */
import * as React from 'react';
import { cn } from '@aazucena/utils';
import { Progress } from './progress.js';

export const PreloaderTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-xl font-bold tracking-tight', className)} {...props} />
));
PreloaderTitle.displayName = 'PreloaderTitle';

export const PreloaderSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('max-w-[280px] text-sm opacity-60', className)} {...props} />
));
PreloaderSubtitle.displayName = 'PreloaderSubtitle';

export const PreloaderProgress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Progress>
>(({ className, ...props }, ref) => (
  <div className="w-full space-y-2">
    <Progress ref={ref} className={cn('h-2 transition-all duration-300', className)} {...props} />
  </div>
));
PreloaderProgress.displayName = 'PreloaderProgress';

export * from './preloader-overlay.js';
export * from './preloader-step.js';
