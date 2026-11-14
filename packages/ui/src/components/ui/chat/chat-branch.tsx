'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ChevronRight, GitFork } from '@aazucena/icons'; // Assuming these icons are available

const chatBranchVariants = cva('flex flex-col gap-3 rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface BranchOption {
  id: string;
  label: string;
  description?: string;
}

export interface ChatBranchProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatBranchVariants> {
  question: string;
  options: BranchOption[];
  selectedOptionId?: string; // ID of the option that was taken/selected
  emptyMessage?: string;
}

const ChatBranch = React.forwardRef<HTMLDivElement, ChatBranchProps>(
  (
    {
      className,
      variant,
      question,
      options,
      selectedOptionId,
      emptyMessage = 'No branching options available.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatBranchVariants({ variant }), className)} {...props}>
        {options.length === 0 && (
          <p className="text-muted-foreground text-center">{emptyMessage}</p>
        )}
        {options.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <GitFork className="h-5 w-5" />
              <h3>{question}</h3>
            </div>
            <ul className="ml-4 flex flex-col gap-2">
              {options.map((option) => (
                <li
                  key={option.id}
                  className={cn(
                    'flex items-start gap-2 text-sm',
                    selectedOptionId === option.id && 'text-primary font-medium',
                  )}
                >
                  <ChevronRight
                    className={cn(
                      'mt-1 h-4 w-4 shrink-0',
                      selectedOptionId === option.id ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.description && (
                      <span
                        className={cn(
                          'text-xs',
                          selectedOptionId === option.id
                            ? 'text-primary/80'
                            : 'text-muted-foreground',
                        )}
                      >
                        {option.description}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  },
);
ChatBranch.displayName = 'ChatBranch';

export { ChatBranch, chatBranchVariants };
