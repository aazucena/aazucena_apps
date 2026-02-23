'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from '../button'; // Assuming Button component is available

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
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatSuggestionVariants> {
  suggestions: string[];
  onSelectSuggestion?: (suggestion: string) => void;
}

const ChatSuggestion = React.forwardRef<HTMLDivElement, ChatSuggestionProps>(
  (
    { className, variant, size, suggestions, onSelectSuggestion, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(chatSuggestionVariants({ variant, size }), className)}
        {...props}
      >
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectSuggestion?.(suggestion)}
            className={cn(
              variant === 'glass' && 'glass-button', // Custom class for glass variant buttons
              variant === 'cyber' && 'cyber-button', // Custom class for cyber variant buttons
            )}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  },
);
ChatSuggestion.displayName = 'ChatSuggestion';

export { ChatSuggestion, chatSuggestionVariants };
