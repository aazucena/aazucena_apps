'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const treeItemVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

const itemRowClasses: Record<string, string> = {
  default: 'hover:bg-muted/50 text-foreground',
  glass: 'hover:bg-white/5 text-foreground/90',
  cyber: 'hover:bg-cyan-500/5 text-cyan-50 font-mono text-xs',
};

export interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeItemProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect' | 'onToggle'>,
    VariantProps<typeof treeItemVariants> {
  node: TreeNode;
  level: number;
  expanded?: Set<string>;
  selected?: string;
  onToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      variant = 'default',
      node,
      level,
      expanded,
      selected,
      onToggle,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded?.has(node.id);
    const isSelected = selected === node.id;

    return (
      <div ref={ref} className={cn(treeItemVariants({ variant }), className)} {...props}>
        <div
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          aria-disabled={node.disabled}
          tabIndex={0}
          onClick={() => {
            if (hasChildren) onToggle?.(node.id);
            onSelect?.(node.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (hasChildren) onToggle?.(node.id);
              onSelect?.(node.id);
            }
          }}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1 transition-colors',
            itemRowClasses[v],
            isSelected && (v === 'cyber' ? 'bg-cyan-500/10' : 'bg-accent'),
            node.disabled && 'pointer-events-none opacity-50',
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Chevron */}
          <span className={cn('shrink-0 transition-transform', !hasChildren && 'invisible')}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn('transition-transform', isExpanded && 'rotate-90')}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
          {/* Icon */}
          {node.icon && <span className="shrink-0 [&_svg]:size-4">{node.icon}</span>}
          {/* Label */}
          <span className="truncate text-sm">{node.label}</span>
        </div>
        {/* Children */}
        {hasChildren && isExpanded && (
          <div role="group">
            {node.children!.map((child) => (
              <TreeItem
                key={child.id}
                variant={variant}
                node={child}
                level={level + 1}
                expanded={expanded}
                selected={selected}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
TreeItem.displayName = 'TreeItem';

export { TreeItem, treeItemVariants };
