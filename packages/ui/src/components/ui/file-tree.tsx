'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ChevronRight, File, Folder } from '@aazucena/icons'; // Assuming these icons are available

const fileTreeVariants = cva('rounded-md border p-4 transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
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
              'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1',
              variant === 'cyber' && 'hover:bg-cyan-500/10',
              variant === 'glass' && 'hover:bg-white/10',
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
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  isExpanded ? 'rotate-90' : 'rotate-0',
                  variant === 'cyber' && 'text-cyan-400',
                  variant === 'glass' && 'text-white/70',
                  variant === 'default' && 'text-muted-foreground',
                )}
              />
            )}
            {isFolder ? (
              <Folder
                className={cn(
                  'h-4 w-4 shrink-0',
                  isExpanded ? 'text-blue-500' : 'text-muted-foreground',
                )}
              />
            ) : (
              <File className={cn('h-4 w-4 shrink-0', 'text-muted-foreground')} />
            )}
            <span
              className={cn(
                variant === 'cyber' && 'font-mono text-cyan-400',
                variant === 'glass' && 'text-white',
              )}
            >
              {node.name}
            </span>
          </div>
          {isFolder && isExpanded && node.children && (
            <ul className="ml-4 border-l border-gray-500/20">{node.children.map(renderNode)}</ul>
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
