'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { FileText, Link, Code, Download } from '@aazucena/icons'; // Assuming these icons are available

const chatArtifactVariants = cva('flex flex-col gap-3 rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
  },
  defaultVariants: { variant: 'default' },
});

export type ArtifactType = 'file' | 'link' | 'code' | 'other';

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  url: string; // URL for download or link
  description?: string;
}

export interface ChatArtifactProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatArtifactVariants> {
  artifacts: Artifact[];
  title?: string;
  emptyMessage?: string;
}

const typeIconMap: Record<ArtifactType, React.ElementType> = {
  file: FileText,
  link: Link,
  code: Code,
  other: Download, // Generic download or other
};

const ChatArtifact = React.forwardRef<HTMLDivElement, ChatArtifactProps>(
  (
    {
      className,
      variant,
      artifacts,
      title = 'Related Artifacts',
      emptyMessage = 'No artifacts generated or referenced.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatArtifactVariants({ variant }), className)} {...props}>
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {artifacts.length === 0 && (
          <p className="text-muted-foreground text-center text-sm">{emptyMessage}</p>
        )}
        <ul className="flex flex-col gap-2">
          {artifacts.map((artifact) => {
            const Icon = (typeIconMap[artifact.type] || Download) as React.ComponentType<{
              className?: string;
            }>;
            return (
              <li key={artifact.id} className="flex items-start gap-3">
                <a
                  href={artifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'hover:bg-muted/50 rounded-control flex items-center gap-2 border p-2 text-sm font-medium transition-colors duration-(--motion-base)',
                    variant === 'cyber' && 'border-signal/30 text-signal hover:bg-signal/10',
                    variant === 'glass' && 'border-input/20 hover:bg-state',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="truncate">{artifact.name}</span>
                    {artifact.description && (
                      <span className="text-muted-foreground text-xs">{artifact.description}</span>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);
ChatArtifact.displayName = 'ChatArtifact';

export { ChatArtifact, chatArtifactVariants };
