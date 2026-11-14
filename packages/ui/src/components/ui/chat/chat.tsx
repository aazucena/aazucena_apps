'use client';

/** @shadcn standard component */
import * as React from 'react';
import { cn } from '@aazucena/utils';

// Core Chat Layout component can stay here if needed, or we just export the parts.
const Chat = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative flex h-full flex-col overflow-hidden', className)}
      {...props}
    />
  ),
);
Chat.displayName = 'Chat';

const ChatFeed = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      // New messages are announced as they arrive, without moving focus.
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Conversation"
      tabIndex={0}
      className={cn(
        'custom-scrollbar focus-visible:outline-signal flex-1 space-y-8 overflow-y-auto p-6 focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-solid',
        className,
      )}
      {...props}
    />
  ),
);
ChatFeed.displayName = 'ChatFeed';

export { Chat, ChatFeed };

export * from './chat-message';
export * from './chat-thread';
export * from './chat-input';
