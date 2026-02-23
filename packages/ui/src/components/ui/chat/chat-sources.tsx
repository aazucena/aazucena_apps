'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Link, FileText, ExternalLink } from '@aazucena/icons'; // Assuming these icons are available
import { Badge } from '../badge';

const chatSourcesVariants = cva(
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

export interface ChatSource {
  id: string;
  title: string;
  url?: string;
  snippet?: string;
  relevanceScore?: number; // 0-100
}

export interface ChatSourcesProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatSourcesVariants> {
  sources: ChatSource[];
  title?: string;
  emptyMessage?: string;
}

const ChatSources = React.forwardRef<HTMLDivElement, ChatSourcesProps>(
  (
    {
      className,
      variant,
      sources,
      title = 'Information Sources',
      emptyMessage = 'No sources provided.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatSourcesVariants({ variant }), className)} {...props}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {sources.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}
        <ul className="flex flex-col gap-2">
          {sources.map(source => (
            <li key={source.id} className="rounded-md bg-muted/50 p-3 text-sm">
              <a
                href={source.url || '#'}
                target={source.url ? '_blank' : '_self'}
                rel={source.url ? 'noopener noreferrer' : undefined}
                className="group flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {source.url ? (
                      <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="font-medium group-hover:underline">{source.title}</span>
                  </div>
                  {source.relevanceScore !== undefined && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {source.relevanceScore}%
                    </Badge>
                  )}
                </div>
                {source.snippet && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{source.snippet}</p>
                )}
                {source.url && (
                  <span className="flex items-center gap-1 text-xs text-blue-500 opacity-80 group-hover:opacity-100">
                    <ExternalLink className="h-3 w-3" /> {new URL(source.url).hostname}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
ChatSources.displayName = 'ChatSources';

export { ChatSources, chatSourcesVariants };
