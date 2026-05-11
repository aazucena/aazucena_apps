'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { User, FileText, Robot, CogFour } from '@aazucena/icons'; // Assuming these icons are available

const chatContextVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
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

export interface ContextItem {
  id: string;
  label: string;
  value: string | number | React.ReactNode;
  icon?: React.ElementType;
}

export interface ChatContextProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatContextVariants> {
  contextItems: ContextItem[];
  title?: string;
  emptyMessage?: string;
}

const defaultIconMap: Record<string, React.ElementType> = {
  persona: User,
  document: FileText,
  model: Robot,
  CogFour: CogFour,
};

const ChatContext = React.forwardRef<HTMLDivElement, ChatContextProps>(
  (
    {
      className,
      variant,
      contextItems,
      title = 'Current Context',
      emptyMessage = 'No active context.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatContextVariants({ variant }), className)} {...props}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {contextItems.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">{emptyMessage}</p>
        )}
        <ul className="flex flex-col gap-2">
          {contextItems.map((item) => {
            const ItemIcon = (item.icon || defaultIconMap[item.id] || null) as React.ComponentType<{
              className?: string;
            }> | null;
            return (
              <li
                key={item.id}
                className="bg-muted/50 flex items-center gap-3 rounded-md p-2 text-sm"
              >
                {ItemIcon && <ItemIcon className="text-muted-foreground h-5 w-5 shrink-0" />}
                <div className="flex flex-grow flex-col">
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="text-muted-foreground truncate">{item.value}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);
ChatContext.displayName = 'ChatContext';

export { ChatContext, chatContextVariants };
