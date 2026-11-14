'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { TreeItem, type TreeNode } from './tree-item';

const treeVariants = cva('w-full select-none', {
  variants: {
    variant: {
      default: 'border border-border rounded-control bg-background',
      glass: 'glass rounded-card',
      cyber: 'border border-signal/30 rounded-control bg-panel',
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

    const treeRef = React.useRef<HTMLDivElement | null>(null);
    const items = () =>
      Array.from(
        treeRef.current?.querySelectorAll<HTMLElement>(
          '[role="treeitem"]:not([aria-disabled="true"])',
        ) ?? [],
      );

    // Roving tab stop (WAI-ARIA APG tree): the selected item, or the first, is the
    // only one in the tab order. Arrow keys move between the visible items.
    const setTabStop = (target?: HTMLElement) => {
      const list = items();
      const stop =
        target ??
        list.find((el) => el.tabIndex === 0) ??
        list.find((el) => el.getAttribute('aria-selected') === 'true') ??
        list[0];
      list.forEach((el) => (el.tabIndex = el === stop ? 0 : -1));
    };
    React.useEffect(() => setTabStop());

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      props.onKeyDown?.(e);
      const current = (e.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
      if (!current || e.defaultPrevented) return;
      const list = items();
      const index = list.indexOf(current);
      const isOpen = current.getAttribute('aria-expanded');
      const id = current.dataset.treeId!;
      let next: HTMLElement | undefined;
      switch (e.key) {
        case 'ArrowDown':
          next = list[index + 1];
          break;
        case 'ArrowUp':
          next = list[index - 1];
          break;
        case 'Home':
          next = list[0];
          break;
        case 'End':
          next = list[list.length - 1];
          break;
        case 'ArrowRight':
          if (isOpen === 'false') handleToggle(id);
          else if (isOpen === 'true') next = list[index + 1];
          break;
        case 'ArrowLeft':
          if (isOpen === 'true') handleToggle(id);
          else {
            const parent = current.parentElement?.parentElement?.closest('[role="group"]')
              ?.previousElementSibling as HTMLElement | null;
            if (parent?.getAttribute('role') === 'treeitem') next = parent;
          }
          break;
        default:
          return;
      }
      e.preventDefault();
      if (next) {
        setTabStop(next);
        next.focus();
      }
    };

    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- composite widget: its items take focus (roving tab stop)
      <div
        ref={(node) => {
          treeRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="tree"
        className={cn(treeVariants({ variant, size }), className)}
        {...props}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          props.onFocus?.(e);
          const item = (e.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
          if (item) setTabStop(item);
        }}
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
