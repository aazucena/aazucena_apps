'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const transferVariants = cva('flex items-stretch gap-2 transition-all', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const panelClass: Record<string, string> = {
  default: 'border-border bg-background',
  glass: 'glass-m border-white/10',
  cyber: 'border-cyan-500/30 bg-black/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
};

export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof transferVariants> {
  items: TransferItem[];
  targetKeys: string[];
  onChange: (targetKeys: string[]) => void;
  titles?: [string, string];
  searchable?: boolean;
  disabled?: boolean;
}

const Transfer = React.forwardRef<HTMLDivElement, TransferProps>(
  (
    {
      className,
      variant = 'default',
      size,
      items,
      targetKeys,
      onChange,
      titles = ['Source', 'Target'],
      searchable = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [sourceSelected, setSourceSelected] = React.useState<Set<string>>(new Set());
    const [targetSelected, setTargetSelected] = React.useState<Set<string>>(new Set());
    const [sourceQuery, setSourceQuery] = React.useState('');
    const [targetQuery, setTargetQuery] = React.useState('');
    const v = variant ?? 'default';

    const targetSet = new Set(targetKeys);
    const sourceItems = items.filter((i) => !targetSet.has(i.key));
    const targetItems = items.filter((i) => targetSet.has(i.key));

    const filterItems = (list: TransferItem[], query: string) =>
      query ? list.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())) : list;

    const moveToTarget = () => {
      onChange([...targetKeys, ...sourceSelected]);
      setSourceSelected(new Set());
    };

    const moveToSource = () => {
      onChange(targetKeys.filter((k) => !targetSelected.has(k)));
      setTargetSelected(new Set());
    };

    const toggleItem = (
      key: string,
      selected: Set<string>,
      setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
    ) => {
      const next = new Set(selected);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setSelected(next);
    };

    const toggleAll = (
      list: TransferItem[],
      selected: Set<string>,
      setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
    ) => {
      const enabled = list.filter((i) => !i.disabled);
      const allSelected = enabled.every((i) => selected.has(i.key));
      setSelected(allSelected ? new Set() : new Set(enabled.map((i) => i.key)));
    };

    const renderPanel = (
      title: string,
      list: TransferItem[],
      selected: Set<string>,
      setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
      query: string,
      setQuery: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      const filtered = filterItems(list, query);
      const enabled = filtered.filter((i) => !i.disabled);
      const allChecked = enabled.length > 0 && enabled.every((i) => selected.has(i.key));

      return (
        <div className={cn('flex w-52 flex-col rounded-lg border', panelClass[v])}>
          <div
            className={cn(
              'flex items-center gap-2 border-b px-3 py-2',
              v === 'cyber' ? 'border-cyan-500/20' : 'border-border',
            )}
          >
            <input
              type="checkbox"
              checked={allChecked}
              onChange={() => toggleAll(filtered, selected, setSelected)}
              disabled={disabled || enabled.length === 0}
              className="size-3.5 rounded"
            />
            <span className="flex-1 font-medium">{title}</span>
            <span className="text-muted-foreground text-xs">
              {selected.size}/{list.length}
            </span>
          </div>
          {searchable && (
            <div
              className={cn(
                'border-b px-2 py-1.5',
                v === 'cyber' ? 'border-cyan-500/20' : 'border-border',
              )}
            >
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  'placeholder:text-muted-foreground w-full bg-transparent px-1 py-0.5 outline-none',
                  v === 'cyber' && 'text-cyan-50',
                )}
              />
            </div>
          )}
          <div className="max-h-48 flex-1 overflow-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-muted-foreground px-2 py-3 text-center text-xs">No items</p>
            ) : (
              filtered.map((item) => (
                <label
                  key={item.key}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors',
                    item.disabled && 'pointer-events-none opacity-50',
                    v === 'cyber' ? 'hover:bg-cyan-500/10' : 'hover:bg-accent',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(item.key)}
                    onChange={() => toggleItem(item.key, selected, setSelected)}
                    disabled={disabled || item.disabled}
                    className="size-3.5 rounded"
                  />
                  <span className="truncate">{item.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          transferVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {renderPanel(
          titles[0]!,
          sourceItems,
          sourceSelected,
          setSourceSelected,
          sourceQuery,
          setSourceQuery,
        )}
        <div className="flex flex-col items-center justify-center gap-1">
          <button
            type="button"
            aria-label="Move to target"
            disabled={disabled || sourceSelected.size === 0}
            onClick={moveToTarget}
            className={cn(
              'rounded-md border p-1.5 transition-all disabled:opacity-30',
              v === 'cyber'
                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                : 'border-border hover:bg-accent',
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Move to source"
            disabled={disabled || targetSelected.size === 0}
            onClick={moveToSource}
            className={cn(
              'rounded-md border p-1.5 transition-all disabled:opacity-30',
              v === 'cyber'
                ? 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10'
                : 'border-border hover:bg-accent',
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>
        </div>
        {renderPanel(
          titles[1]!,
          targetItems,
          targetSelected,
          setTargetSelected,
          targetQuery,
          setTargetQuery,
        )}
      </div>
    );
  },
);
Transfer.displayName = 'Transfer';

export { Transfer, transferVariants };
