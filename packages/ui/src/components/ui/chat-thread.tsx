'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export const ChatThreadList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-2 p-4', className)} role="list" {...props} />
));
ChatThreadList.displayName = 'ChatThreadList';

export const chatThreadVariants = cva(
  'w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden flex items-start gap-3 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900',
        glass:
          'bg-background/5 dark:bg-white/5 backdrop-blur-md border-border/10 text-foreground hover:bg-background/10 dark:bg-white/10 hover:border-border/20',
        cyber: 'bg-background/40 dark:bg-black/40 border-cyan-500/20 text-foreground hover:border-cyan-400',
      },
      isActive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        isActive: true,
        className: 'bg-primary-500/5 border-primary-500/30 text-primary-500 shadow-sm',
      },
      {
        variant: 'cyber',
        isActive: true,
        className:
          'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      isActive: false,
    },
  },
);

export const ChatThread = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chatThreadVariants>
>(({ className, variant, isActive, ...props }, ref) => (
  <div className="group/thread relative">
    <button
      ref={ref}
      className={cn(chatThreadVariants({ variant, isActive }), className)}
      {...props}
    />
  </div>
));
ChatThread.displayName = 'ChatThread';

export const ChatThreadIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode }
>(({ className, icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-0.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100',
      className,
    )}
    {...props}
  />
));
ChatThreadIcon.displayName = 'ChatThreadIcon';

export const ChatThreadContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('min-w-0 flex-1 pr-8', className)} {...props} />
));
ChatThreadContent.displayName = 'ChatThreadContent';

export const ChatThreadTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'truncate text-[11px] leading-tight font-bold tracking-tight uppercase',
      className,
    )}
    {...props}
  />
));
ChatThreadTitle.displayName = 'ChatThreadTitle';

export const ChatThreadMeta = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('mt-1 font-mono text-[8px] tracking-widest uppercase opacity-50', className)}
    {...props}
  />
));
ChatThreadMeta.displayName = 'ChatThreadMeta';

export const chatThreadActionVariants = cva(
  'absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all z-20 opacity-0 group-hover/thread:opacity-100 border focus:opacity-100',
  {
    variants: {
      variant: {
        default:
          'bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white',
        cyber:
          'bg-background dark:bg-black border-border dark:border-cyan-500/20 text-primary dark:text-cyan-400 hover:border-primary dark:hover:border-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const ChatThreadAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof chatThreadActionVariants>
>(({ className, variant, ...props }, ref) => (
  <button ref={ref} className={cn(chatThreadActionVariants({ variant }), className)} {...props} />
));
ChatThreadAction.displayName = 'ChatThreadAction';
