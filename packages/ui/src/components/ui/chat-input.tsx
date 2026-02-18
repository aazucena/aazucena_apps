'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { Send } from '@aazucena/icons';
import { Textarea } from './textarea.js';
import { Button } from './button.js';

export const ChatInputContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('border-t border-current/5 bg-current/5 p-6', className)}
    {...props}
  />
));
ChatInputContainer.displayName = 'ChatInputContainer';

export const ChatInputWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative flex items-end gap-3', className)} {...props} />
));
ChatInputWrapper.displayName = 'ChatInputWrapper';

export const ChatInputArea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof Textarea> & { variant?: 'default' | 'glass' | 'cyber' }
>(({ className, variant = 'default', ...props }, ref) => (
  <Textarea
    ref={ref}
    variant={variant}
    className={cn(
      'min-h-[56px] w-full resize-none py-4 pr-14 pl-6 font-mono text-xs shadow-inner',
      variant === 'cyber' ? 'rounded-xl' : 'rounded-2xl',
      className,
    )}
    {...props}
  />
));
ChatInputArea.displayName = 'ChatInputArea';

export const ChatInputSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <div className="absolute right-3 bottom-3">
    <Button
      ref={ref}
      size="icon"
      className={cn('h-10 w-10 rounded-xl shadow-lg', className)}
      {...props}
    >
      <Send size={18} />
    </Button>
  </div>
));
ChatInputSubmit.displayName = 'ChatInputSubmit';

export const ChatInputFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-3 flex items-center justify-between px-2 font-mono text-[8px] tracking-widest uppercase opacity-40',
      className,
    )}
    {...props}
  />
));
ChatInputFooter.displayName = 'ChatInputFooter';
