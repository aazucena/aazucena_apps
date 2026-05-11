'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from '../button';

const chatSuggestionVariants = cva('flex flex-wrap gap-2', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      default: '',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ChatSuggestionProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatSuggestionVariants> {
  suggestions: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  /** Per-chip color classes cycled by index. Each string replaces the default outline button styles for that chip. */
  chipColors?: string[];
}

const ChatSuggestion = React.forwardRef<HTMLDivElement, ChatSuggestionProps>(
  ({ className, variant, size, suggestions, onSelectSuggestion, chipColors, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chatSuggestionVariants({ variant, size }), className)}
        {...props}
      >
        {suggestions.map((suggestion, index) => {
          const colorClass = chipColors?.[index % chipColors.length];
          return (
            <Button
              key={index}
              variant={colorClass ? undefined : 'outline'}
              size="sm"
              onClick={() => onSelectSuggestion?.(suggestion)}
              className={cn(
                colorClass,
                !colorClass && variant === 'glass' && 'glass-button',
                !colorClass && variant === 'cyber' && 'cyber-button',
              )}
            >
              {suggestion}
            </Button>
          );
        })}
      </div>
    );
  },
);
ChatSuggestion.displayName = 'ChatSuggestion';

export { ChatSuggestion, chatSuggestionVariants };
