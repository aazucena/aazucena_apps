'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Activity, Sparkles } from '@aazucena/icons';

export const chatMessageVariants = cva('flex w-full gap-4 transition-all duration-300 group/msg', {
  variants: {
    role: {
      user: 'flex-row-reverse',
      assistant: 'flex-row',
      system: 'flex-col items-center justify-center text-center',
    },
  },
  defaultVariants: {
    role: 'assistant',
  },
});

export const ChatMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof chatMessageVariants>
>(({ className, role, ...props }, ref) => (
  <div ref={ref} className={cn(chatMessageVariants({ role }), className)} {...props} />
));
ChatMessage.displayName = 'ChatMessage';

export const chatAvatarVariants = cva(
  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover/msg:scale-110',
  {
    variants: {
      variant: {
        default: 'bg-muted border-border text-muted-foreground',
        glass: 'glass text-foreground',
        cyber:
          'bg-primary/10 dark:bg-cyan-500/10 border-border dark:border-cyan-500/20 text-muted-foreground dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
        ai: 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const ChatAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof chatAvatarVariants> & { icon?: React.ReactNode }
>(({ className, variant, icon, ...props }, ref) => (
  <div ref={ref} className={cn(chatAvatarVariants({ variant }), className)} {...props}>
    {icon ||
      (variant === 'ai' || variant === 'cyber' ? <Sparkles size={16} /> : <Activity size={16} />)}
  </div>
));
ChatAvatar.displayName = 'ChatAvatar';

export const ChatContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { role?: 'user' | 'assistant' }
>(({ className, role, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group/bubble relative flex max-w-[85%] flex-col',
      role === 'user' ? 'items-end text-right' : 'items-start text-left',
      className,
    )}
    {...props}
  />
));
ChatContent.displayName = 'ChatContent';

export const chatBubbleVariants = cva(
  'p-5 rounded-2xl text-sm font-mono leading-relaxed transition-all border group relative shadow-sm',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200',
        muted:
          'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800',
        glass: 'glass text-foreground',
        cyber: 'bg-background/80 dark:bg-black/80 border-cyan-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      },
      role: {
        user: 'rounded-tr-none',
        assistant: 'rounded-tl-none',
        system: 'rounded-none text-center italic opacity-60',
      },
    },
    defaultVariants: {
      variant: 'default',
      role: 'assistant',
    },
  },
);

export const ChatBubble = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof chatBubbleVariants>
>(({ className, variant, role, ...props }, ref) => (
  <div ref={ref} className={cn(chatBubbleVariants({ variant, role }), className)} {...props} />
));
ChatBubble.displayName = 'ChatBubble';

export const ChatReasoning = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-primary/30 glass bg-primary-100 my-3 rounded-r-lg border-l-2 py-2 pl-3 text-left font-mono text-[11px] text-muted-foreground italic',
        className,
      )}
      {...props}
    >
      <span className="text-primary/50 mb-1 block text-[9px] font-black tracking-tighter uppercase">
        INTERNAL_REASONING
      </span>
      {children}
    </div>
  ),
);
ChatReasoning.displayName = 'ChatReasoning';

export const ChatHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string; timestamp?: string }
>(({ className, label, timestamp, children, ...props }, ref) => (
  <div ref={ref} className={cn('mb-1.5 flex items-center gap-2 px-1', className)} {...props} />
));
ChatHeader.displayName = 'ChatHeader';

export const ChatActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-4 flex items-center gap-2 border-t border-current/5 pt-3 opacity-30 transition-all duration-300 group-hover/bubble:opacity-100',
        className,
      )}
      {...props}
    />
  ),
);
ChatActions.displayName = 'ChatActions';
