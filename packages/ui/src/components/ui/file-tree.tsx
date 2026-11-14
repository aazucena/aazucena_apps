'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ChevronRight, File, Folder } from '@aazucena/icons'; // Assuming these icons are available

const fileTreeVariants = cva('rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
    size: {
      default: 'text-sm',
      sm: 'text-xs',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  isExpanded?: boolean;
}

export interface FileTreeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof fileTreeVariants> {
  data: FileTreeNode[];
  onNodeClick?: (node: FileTreeNode) => void;
  defaultExpandedIds?: string[];
}

const FileTree = React.forwardRef<HTMLDivElement, FileTreeProps>(
  ({ className, variant, size, data, onNodeClick, defaultExpandedIds = [], ...props }, ref) => {
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
      new Set(defaultExpandedIds),
    );

    const toggleExpand = (id: string) => {
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    };

    const renderNode = (node: FileTreeNode) => {
      const isFolder = node.type === 'folder';
      const isExpanded = expandedNodes.has(node.id);

      return (
        <li
          key={node.id}
          className={cn('flex flex-col', size === 'sm' && 'py-0.5', size === 'lg' && 'py-1')}
        >
          <div
            className={cn(
              'rounded-control flex cursor-pointer items-center gap-2 px-2 py-1',
              variant === 'cyber' && 'hover:bg-signal/10',
              variant === 'glass' && 'hover:bg-state',
              'hover:bg-muted/50',
            )}
            onClick={() => {
              if (isFolder) {
                toggleExpand(node.id);
              }
              onNodeClick?.(node);
            }}
          >
            {isFolder && (
              <ChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-(--motion-base)',
                  isExpanded ? 'rotate-90' : 'rotate-0',
                  variant === 'cyber' && 'text-signal',
                  variant === 'glass' && 'text-foreground/70',
                  variant === 'default' && 'text-muted-foreground',
                )}
              />
            )}
            {isFolder ? (
              <Folder
                className={cn(
                  'h-4 w-4 shrink-0',
                  isExpanded ? 'text-signal' : 'text-muted-foreground',
                )}
              />
            ) : (
              <File className={cn('h-4 w-4 shrink-0', 'text-muted-foreground')} />
            )}
            <span
              className={cn(
                variant === 'cyber' && 'text-signal font-mono',
                variant === 'glass' && 'text-foreground',
              )}
            >
              {node.name}
            </span>
          </div>
          {isFolder && isExpanded && node.children && (
            <ul className="border-rule-strong/20 ml-4 border-l">{node.children.map(renderNode)}</ul>
          )}
        </li>
      );
    };

    return (
      <div ref={ref} className={cn(fileTreeVariants({ variant }), className)} {...props}>
        <ul className="space-y-1">{data.map(renderNode)}</ul>
      </div>
    );
  },
);
FileTree.displayName = 'FileTree';

export { FileTree, fileTreeVariants };
