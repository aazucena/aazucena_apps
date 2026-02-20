'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const treeTableVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
  },
  defaultVariants: { variant: 'default' },
});

const wrapperStyles: Record<string, string> = {
  default: '',
  glass: 'glass dark:bg-background/5 dark:bg-white/5 dark:border-border/10 shadow-xl rounded-lg',
  cyber:
    'border border-border/10 dark:border-cyan-500/30 glass bg-primary-100 dark:bg-background/80 dark:bg-black/80 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-lg',
};

const headerStyles: Record<string, string> = {
  default: '',
  glass: 'bg-background/5 dark:bg-white/5 [&_th]:border-border/10',
  cyber:
    'glass bg-primary-100 dark:bg-cyan-500/5 [&_th]:border-border/10 dark:[&_th]:border-cyan-500/20',
};

const rowStyles: Record<string, string> = {
  default: 'hover:bg-muted/50 border-b',
  glass: 'hover:bg-background/5 dark:hover:bg-white/5 border-b border-border/10',
  cyber:
    'hover:bg-primary/10 dark:hover:bg-cyan-500/10 border-b border-border/10 dark:border-cyan-500/20',
};

export interface TreeTableNode {
  key: string;
  data: Record<string, unknown>;
  children?: TreeTableNode[];
}

export interface TreeTableColumn {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, node: TreeTableNode) => React.ReactNode;
}

export interface TreeTableProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof treeTableVariants> {
  data: TreeTableNode[];
  columns: TreeTableColumn[];
  defaultExpanded?: string[];
  onToggle?: (key: string) => void;
}

function TreeTableRow({
  node,
  columns,
  variant,
  depth,
  expanded,
  onToggle,
}: {
  node: TreeTableNode;
  columns: TreeTableColumn[];
  variant: string;
  depth: number;
  expanded: Set<string>;
  onToggle: (key: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.key);

  return (
    <>
      <tr className={cn(rowStyles[variant], 'transition-colors')}>
        {columns.map((col, colIndex) => (
          <td
            key={col.key}
            className="p-2 align-middle"
            style={colIndex === 0 ? { paddingLeft: `${depth * 24 + 8}px` } : undefined}
          >
            {colIndex === 0 ? (
              <div className="flex items-center gap-1.5">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => onToggle(node.key)}
                    className={cn(
                      'shrink-0 rounded p-0.5 transition-colors',
                      variant === 'cyber'
                        ? 'text-cyan-400 hover:bg-cyan-500/10'
                        : 'text-muted-foreground hover:bg-accent',
                    )}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={cn('transition-transform', isExpanded && 'rotate-90')}
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ) : (
                  <span className="inline-block w-[22px]" />
                )}
                <span>
                  {col.render
                    ? col.render(node.data[col.key], node)
                    : String(node.data[col.key] ?? '')}
                </span>
              </div>
            ) : col.render ? (
              col.render(node.data[col.key], node)
            ) : (
              String(node.data[col.key] ?? '')
            )}
          </td>
        ))}
      </tr>
      {hasChildren &&
        isExpanded &&
        node.children!.map((child) => (
          <TreeTableRow
            key={child.key}
            node={child}
            columns={columns}
            variant={variant}
            depth={depth + 1}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
    </>
  );
}

const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(
  (
    {
      className,
      variant = 'default',
      data,
      columns,
      defaultExpanded = [],
      onToggle: onToggleProp,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState<Set<string>>(new Set(defaultExpanded));
    const v = variant ?? 'default';

    const handleToggle = (key: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
      onToggleProp?.(key);
    };

    return (
      <div
        ref={ref}
        className={cn('relative w-full overflow-auto', wrapperStyles[v], className)}
        {...props}
      >
        <table className={cn(treeTableVariants({ variant }), 'caption-bottom text-sm')}>
          <thead className={cn('[&_tr]:border-b', headerStyles[v])}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-muted-foreground h-10 px-2 text-left align-middle font-medium"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((node) => (
              <TreeTableRow
                key={node.key}
                node={node}
                columns={columns}
                variant={v}
                depth={0}
                expanded={expanded}
                onToggle={handleToggle}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);
TreeTable.displayName = 'TreeTable';

export { TreeTable, treeTableVariants };
