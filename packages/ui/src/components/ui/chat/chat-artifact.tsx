'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { FileText, Link, Code, Download } from '@aazucena/icons'; // Assuming these icons are available

const chatArtifactVariants = cva(
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

export type ArtifactType = 'file' | 'link' | 'code' | 'other';

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  url: string; // URL for download or link
  description?: string;
}

export interface ChatArtifactProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatArtifactVariants> {
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
          <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}
        <ul className="flex flex-col gap-2">
          {artifacts.map(artifact => {
            const Icon = typeIconMap[artifact.type] || Download;
            return (
              <li key={artifact.id} className="flex items-start gap-3">
                <a
                  href={artifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-2 rounded-md border p-2 text-sm font-medium transition-colors duration-200 hover:bg-muted/50',
                    variant === 'cyber' && 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10',
                    variant === 'glass' && 'border-input/20 hover:bg-white/10',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="truncate">{artifact.name}</span>
                    {artifact.description && (
                      <span className="text-xs text-muted-foreground">
                        {artifact.description}
                      </span>
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
