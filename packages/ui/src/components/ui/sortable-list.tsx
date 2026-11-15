'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const sortableListVariants = cva('flex flex-col gap-1 rounded-control', {
  variants: {
    variant: {
      default: '',
      glass: 'rounded-card p-3 glass',
      cyber: 'rounded-card p-3 bg-background/40 dark:bg-panel border border-signal/30',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface DragHandleProps {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
  /** Keyboard reordering: the handle is a tab stop and moves its item with the arrow keys. */
  tabIndex: 0;
  role: 'button';
  'aria-roledescription': 'sortable item';
  'aria-label': string | undefined;
  'data-sortable-handle': string;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface SortableListProps<T>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof sortableListVariants> {
  items: T[];
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => React.ReactNode;
  onReorder: (items: T[]) => void;
  keyExtractor: (item: T) => string;
  /**
   * Accessible name for a handle. Defaults to "Reorder item 2 of 5. Use the arrow keys to move it".
   * Return `undefined` when the handle is the whole item, so its own text is its name.
   */
  getHandleLabel?: (item: T, index: number, total: number) => string | undefined;
}

function SortableListInner<T>(
  {
    className,
    variant,
    items,
    renderItem,
    onReorder,
    keyExtractor,
    getHandleLabel,
    ...props
  }: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
  ref: React.Ref<HTMLDivElement>,
) {
  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [overIdx, setOverIdx] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIdx(index);
  };

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(index, 0, moved!);
    onReorder(next);
    setDragIdx(null);
    setOverIdx(null);
  };

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const focusKey = React.useRef<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');

  // Moving a DOM node can drop focus, so put it back on the handle that was moved.
  React.useEffect(() => {
    if (focusKey.current === null) return;
    const key = focusKey.current;
    focusKey.current = null;
    const handles = listRef.current?.querySelectorAll<HTMLElement>('[data-sortable-handle]');
    handles?.forEach((el) => {
      if (el.dataset.sortableHandle === key) el.focus();
    });
  }, [items]);

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= items.length || to === from) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    focusKey.current = keyExtractor(moved!);
    setAnnouncement(`Moved to position ${to + 1} of ${items.length}`);
    onReorder(next);
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    const target =
      e.key === 'ArrowUp'
        ? index - 1
        : e.key === 'ArrowDown'
          ? index + 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? items.length - 1
              : null;
    if (target === null) return;
    e.preventDefault();
    moveTo(index, target);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(sortableListVariants({ variant }), className)}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          className={cn(
            'transition duration-(--motion-base)',
            '[&_[data-sortable-handle]:focus-visible]:outline-signal [&_[data-sortable-handle]:focus-visible]:outline-1 [&_[data-sortable-handle]:focus-visible]:outline-offset-2 [&_[data-sortable-handle]:focus-visible]:outline-solid',
            dragIdx === index && 'opacity-50',
            overIdx === index && dragIdx !== index && 'border-primary border-t-2',
          )}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop(index)}
          onDragEnd={handleDragEnd}
        >
          {renderItem(item, index, {
            draggable: true,
            onDragStart: handleDragStart(index),
            tabIndex: 0,
            role: 'button',
            'aria-roledescription': 'sortable item',
            'aria-label': getHandleLabel
              ? getHandleLabel(item, index, items.length)
              : `Reorder item ${index + 1} of ${items.length}. Use the arrow keys to move it`,
            'data-sortable-handle': keyExtractor(item),
            onKeyDown: handleKeyDown(index),
          })}
        </div>
      ))}
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

const SortableList = React.forwardRef(SortableListInner) as <T>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export { SortableList, sortableListVariants };
