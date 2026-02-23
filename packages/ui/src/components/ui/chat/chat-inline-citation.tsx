'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../popover'; // Assuming Popover components are available

const chatInlineCitationVariants = cva(
  'inline-flex items-center justify-center rounded-full border bg-muted text-muted-foreground transition-colors duration-200 hover:bg-muted/80',
  {
    variants: {
      variant: {
        default: 'border-transparent',
        glass: 'glass border-border/20',
        cyber: 'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_5px_rgba(6,182,212,0.1)] text-cyan-400',
      },
      size: {
        default: 'h-5 w-5 text-xs',
        sm: 'h-4 w-4 text-xs',
        lg: 'h-6 w-6 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface CitationSource {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
}

export interface ChatInlineCitationProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chatInlineCitationVariants> {
  citationKey: string | number;
  source: CitationSource;
}

const ChatInlineCitation = React.forwardRef<HTMLSpanElement, ChatInlineCitationProps>(
  (
    {
      className,
      variant,
      size,
      citationKey,
      source,
      ...props
    },
    ref,
  ) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <span
            ref={ref}
            className={cn(chatInlineCitationVariants({ variant, size }), className)}
            role="button"
            tabIndex={0}
            {...props}
          >
            [{citationKey}]
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-2">
            <h4 className="font-semibold">{source.title}</h4>
            {source.url && (
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                {source.url.length > 50 ? source.url.substring(0, 47) + '...' : source.url}
              </a>
            )}
            {source.snippet && (
              <p className="text-sm text-muted-foreground">
                {source.snippet.length > 150 ? source.snippet.substring(0, 147) + '...' : source.snippet}
              </p>
            )}
            {!source.url && !source.snippet && (
              <p className="text-sm text-muted-foreground">No additional details available for this source.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
ChatInlineCitation.displayName = 'ChatInlineCitation';

export { ChatInlineCitation, chatInlineCitationVariants };
