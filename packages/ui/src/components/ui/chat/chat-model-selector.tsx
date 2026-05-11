'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'; // Assuming Select components are available
import { Robot, ChevronDown } from '@aazucena/icons';

const chatModelSelectorVariants = cva(
  'flex items-center gap-2 rounded-md border p-2 transition-all duration-300',
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

export interface AiModel {
  id: string;
  name: string;
  description?: string;
  provider?: string;
}

export interface ChatModelSelectorProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatModelSelectorVariants> {
  models: AiModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  placeholder?: string;
}

const ChatModelSelector = React.forwardRef<HTMLDivElement, ChatModelSelectorProps>(
  (
    {
      className,
      variant,
      models,
      selectedModelId,
      onSelectModel,
      placeholder = 'Select AI Model',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatModelSelectorVariants({ variant }), className)} {...props}>
        <Select value={selectedModelId} onValueChange={onSelectModel}>
          <SelectTrigger
            className={cn(
              'flex items-center gap-2 [&>span]:line-clamp-1',
              variant === 'cyber' && 'border-cyan-500/30 bg-cyan-500/5 font-mono text-cyan-400',
              variant === 'glass' && 'glass border-input/20',
            )}
          >
            <Robot className="h-4 w-4 shrink-0" />
            <SelectValue placeholder={placeholder} />
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              variant === 'cyber' && 'border-cyan-500/30 bg-black font-mono text-cyan-400',
              variant === 'glass' && 'glass border-input/20',
            )}
          >
            {models.map((model) => (
              <SelectItem
                key={model.id}
                value={model.id}
                className={cn(
                  variant === 'cyber' && 'focus:bg-cyan-500/20 focus:text-cyan-400',
                  variant === 'glass' && 'focus:bg-white/10 focus:text-white',
                )}
              >
                {model.name} {model.provider && `(${model.provider})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);
ChatModelSelector.displayName = 'ChatModelSelector';

export { ChatModelSelector, chatModelSelectorVariants };
