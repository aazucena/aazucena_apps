'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'; // Assuming Collapsible components are available
import { ChevronsUpDown } from '@aazucena/icons'; // Assuming ChevronsUpDown icon is available

const chatChainOfThoughtVariants = cva(
  'flex flex-col gap-4 rounded-md border p-4 transition-all duration-300',
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

export interface ChainOfThoughtStep {
  id: string;
  title: string;
  description: string;
  isExpanded?: boolean;
}

export interface ChatChainOfThoughtProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatChainOfThoughtVariants> {
  chain: ChainOfThoughtStep[];
  emptyMessage?: string;
}

const ChatChainOfThought = React.forwardRef<HTMLDivElement, ChatChainOfThoughtProps>(
  (
    { className, variant, chain, emptyMessage = 'No chain of thought available.', ...props },
    ref,
  ) => {
    const [expandedStates, setExpandedStates] = React.useState<Record<string, boolean>>({});

    React.useEffect(() => {
      const initialExpanded = chain.reduce(
        (acc, step) => {
          acc[step.id] = step.isExpanded || false;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setExpandedStates(initialExpanded);
    }, [chain]);

    const toggleExpanded = (id: string) => {
      setExpandedStates((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
      <div ref={ref} className={cn(chatChainOfThoughtVariants({ variant }), className)} {...props}>
        {chain.length === 0 && <p className="text-muted-foreground text-center">{emptyMessage}</p>}
        <div className="flex flex-col gap-2">
          {chain.map((step, index) => (
            <Collapsible
              key={step.id}
              open={expandedStates[step.id]}
              onOpenChange={() => toggleExpanded(step.id)}
              className="bg-muted/50 rounded-md border p-3"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between text-left font-semibold">
                <span>{`Step ${index + 1}: ${step.title}`}</span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="text-muted-foreground pt-2 text-sm">
                {step.description}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    );
  },
);
ChatChainOfThought.displayName = 'ChatChainOfThought';

export { ChatChainOfThought, chatChainOfThoughtVariants };
