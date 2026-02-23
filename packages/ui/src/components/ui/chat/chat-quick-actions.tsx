'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from '../button'; // Assuming Button component is available
import { Message, PlusCircle, CogFour, Trash } from '@aazucena/icons'; // Assuming these icons are available

const chatQuickActionsVariants = cva(
  'flex flex-wrap items-center gap-2 rounded-md border p-4 transition-all duration-300',
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

export interface ChatQuickAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

export interface ChatQuickActionsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatQuickActionsVariants> {
  actions: ChatQuickAction[];
  onActionClick?: (actionId: string) => void;
  title?: string;
  emptyMessage?: string;
}

const iconMap: Record<string, React.ElementType> = {
  message: Message,
  plus: PlusCircle,
  CogFour: CogFour,
  delete: Trash,
};

const ChatQuickActions = React.forwardRef<HTMLDivElement, ChatQuickActionsProps>(
  (
    {
      className,
      variant,
      actions,
      onActionClick,
      title = 'Available Actions',
      emptyMessage = 'No actions available.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatQuickActionsVariants({ variant }), className)} {...props}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {actions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {actions.map(action => {
            const Icon = action.icon || null;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onActionClick?.(action.id)}
                disabled={action.disabled}
                className={cn(
                  variant === 'glass' && 'glass-button',
                  variant === 'cyber' && 'cyber-button',
                )}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  },
);
ChatQuickActions.displayName = 'ChatQuickActions';

export { ChatQuickActions, chatQuickActionsVariants };
