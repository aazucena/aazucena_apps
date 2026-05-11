'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const virtualListVariants = cva('overflow-auto rounded-md border transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      glass: 'glass border-border/20',
      cyber:
        'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface VirtualListProps<T>
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof virtualListVariants> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
  height?: number | string;
}

function VirtualListInner<T>(
  {
    className,
    variant,
    items,
    renderItem,
    itemHeight,
    overscan = 5,
    height = 400,
    style,
    ...props
  }: VirtualListProps<T> & { innerRef?: React.Ref<HTMLDivElement> },
  ref: React.Ref<HTMLDivElement>,
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerHeight = typeof height === 'number' ? height : 400;

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      ref={ref}
      className={cn(virtualListVariants({ variant }), className)}
      style={{ height, ...style }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => {
          const index = startIndex + i;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: itemHeight,
                transform: `translateY(${index * itemHeight}px)`,
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const VirtualList = React.forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export { VirtualList, virtualListVariants };
