'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Activity, Sparkles } from '@aazucena/icons';

export interface ChatMessageProps {
  role?: 'user' | 'assistant' | 'system';
}

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
  'w-8 h-8 rounded-card flex items-center justify-center shrink-0 border transition-transform group-hover/msg:scale-110',
  {
    variants: {
      variant: {
        default: 'bg-muted border-border text-muted-foreground',
        glass: 'glass text-foreground',
        cyber:
          'bg-primary/10 dark:bg-signal/10 border-border dark:border-signal/20 text-muted-foreground dark:text-signal',
        ai: 'bg-primary/10 border-primary/20 text-primary',
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
  React.HTMLAttributes<HTMLDivElement> & ChatMessageProps
>(({ className, role, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group/bubble relative flex max-w-[85%] flex-col',
      role === 'user' ? 'items-end text-left' : 'items-start text-left',
      className,
    )}
    {...props}
  />
));
ChatContent.displayName = 'ChatContent';

export const chatBubbleVariants = cva(
  'p-5 rounded-card text-sm font-mono leading-relaxed transition-all border group relative',
  {
    variants: {
      variant: {
        default: 'bg-panel dark:bg-background border-rule text-foreground',
        muted: 'bg-panel text-foreground border-rule',
        glass: 'glass text-foreground',
        cyber: 'bg-background/80 dark:bg-scrim border-signal/30 text-foreground',
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
        'border-primary/30 glass bg-signal-faint text-muted-foreground rounded-r-control my-3 border-l-2 px-4 py-2 text-left font-mono text-[11px] italic',
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
>(({ className, label: _label, timestamp: _timestamp, children, ...props }, ref) => (
  <div ref={ref} className={cn('mb-1.5 flex items-center gap-2 px-1', className)} {...props}>
    {children}
  </div>
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
