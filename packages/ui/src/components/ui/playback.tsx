'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Button } from './button';

const playbackVariants = cva(
  'flex items-center gap-6 px-8 py-4 border-b transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
        glass: 'bg-background/5 dark:bg-white/5 backdrop-blur-md border-border/10 text-foreground',
        cyber:
          'bg-background dark:bg-black border border-border dark:border-cyan-500/30 text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Playback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof playbackVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(playbackVariants({ variant }), className)} {...props} />
));
Playback.displayName = 'Playback';

const PlaybackCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { current: number; total: number }
>(({ className, current, total, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-primary shrink-0 font-mono text-[10px] font-black tracking-[0.2em] uppercase',
      className,
    )}
    {...props}
  >
    Step_{current.toString().padStart(3, '0')} / {total.toString().padStart(3, '0')}
  </div>
));
PlaybackCounter.displayName = 'PlaybackCounter';

const PlaybackControls = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
  ),
);
PlaybackControls.displayName = 'PlaybackControls';

const PlaybackButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { active?: boolean }
>(({ className, variant = 'ghost', size = 'icon', active, ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      'rounded-xl transition-all',
      active && 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg',
      className,
    )}
    {...props}
  />
));
PlaybackButton.displayName = 'PlaybackButton';

const PlaybackActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ml-auto flex items-center gap-8', className)} {...props} />
  ),
);
PlaybackActions.displayName = 'PlaybackActions';

export {
  Playback,
  PlaybackActions,
  PlaybackButton,
  PlaybackControls,
  PlaybackCounter,
  playbackVariants,
};
