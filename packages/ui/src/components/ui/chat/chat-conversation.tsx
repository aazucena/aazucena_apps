'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ChatInput } from './chat-input'; // Will be enhanced later
import { ChatMessage, ChatFeed } from './chat'; // Existing chat components
import type { ChatMessageProps } from './chat-message'; // For message type definition

const chatConversationVariants = cva(
  'flex flex-col h-full rounded-md border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ConversationMessage extends ChatMessageProps {
  id: string;
  content: React.ReactNode;
}

export interface ChatConversationProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatConversationVariants> {
  messages: ConversationMessage[];
  onSendMessage: (message: string) => void;
  title?: string;
  placeholder?: string;
  footer?: React.ReactNode;
}

const ChatConversation = React.forwardRef<HTMLDivElement, ChatConversationProps>(
  (
    {
      className,
      variant,
      messages,
      onSendMessage,
      title = 'Chat Conversation',
      placeholder = 'Type your message...',
      footer,
      ...props
    },
    ref,
  ) => {
    const chatFeedRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      // Scroll to bottom on new message
      if (chatFeedRef.current) {
        chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
      }
    }, [messages]);

    return (
      <div ref={ref} className={cn(chatConversationVariants({ variant }), className)} {...props}>
        {title && (
          <div className="flex items-center justify-between border-b border-input p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        <ChatFeed ref={chatFeedRef} className="flex-grow p-4">
          {messages.map(msg => (
            <ChatMessage key={msg.id} role={msg.role} className="mb-4">
              {msg.content}
            </ChatMessage>
          ))}
        </ChatFeed>
        <div className="flex-shrink-0">
          {/* ChatInput will be enhanced later */}
          <ChatInput onSendMessage={onSendMessage} placeholder={placeholder} />
          {footer && <div className="p-4 border-t border-input">{footer}</div>}
        </div>
      </div>
    );
  },
);
ChatConversation.displayName = 'ChatConversation';

export { ChatConversation, chatConversationVariants };
