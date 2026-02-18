'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const sortableListVariants = cva('flex flex-col gap-1 rounded-md transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      glass: 'rounded-2xl p-3 glass',
      cyber:
        'rounded-2xl p-3 bg-background/40 dark:bg-black/40 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface DragHandleProps {
  draggable: true;
  onDragStart: (e: React.DragEvent) => void;
}

export interface SortableListProps<T>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof sortableListVariants> {
  items: T[];
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => React.ReactNode;
  onReorder: (items: T[]) => void;
  keyExtractor: (item: T) => string;
}

function SortableListInner<T>(
  {
    className,
    variant,
    items,
    renderItem,
    onReorder,
    keyExtractor,
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

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div ref={ref} className={cn(sortableListVariants({ variant }), className)} {...props}>
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          className={cn(
            'transition-all duration-150',
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
          })}
        </div>
      ))}
    </div>
  );
}

const SortableList = React.forwardRef(SortableListInner) as <T>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export { SortableList, sortableListVariants };
