'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { TreeItem, type TreeNode } from './tree-item';

const treeVariants = cva('w-full select-none', {
  variants: {
    variant: {
      default: 'border border-border rounded-lg bg-background',
      glass: 'glass rounded-xl',
      cyber: 'border border-cyan-500/30 rounded-lg bg-black/80',
    },
    size: {
      sm: 'p-1 text-xs',
      md: 'p-2 text-sm',
      lg: 'p-3 text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export interface TreeProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'>,
    VariantProps<typeof treeVariants> {
  data: TreeNode[];
  defaultExpanded?: string[];
  selected?: string;
  onSelect?: (id: string) => void;
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ className, variant, size, data, defaultExpanded = [], selected, onSelect, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState<Set<string>>(new Set(defaultExpanded));

    const handleToggle = (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    return (
      <div
        ref={ref}
        role="tree"
        className={cn(treeVariants({ variant, size }), className)}
        {...props}
      >
        {data.map((node) => (
          <TreeItem
            key={node.id}
            variant={variant}
            node={node}
            level={0}
            expanded={expanded}
            selected={selected}
            onToggle={handleToggle}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
);
Tree.displayName = 'Tree';

export { Tree, treeVariants };
export type { TreeNode };
