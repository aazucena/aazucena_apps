'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const infiniteScrollerVariants = cva('scroller relative z-20 overflow-hidden', {
  variants: {
    variant: {
      default: '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
      full: '',
    },
    speed: {
      fast: '[--animation-duration:20s]',
      normal: '[--animation-duration:40s]',
      slow: '[--animation-duration:80s]',
    },
    direction: {
      left: '[--animation-direction:forwards]',
      right: '[--animation-direction:reverse]',
    },
  },
  defaultVariants: {
    variant: 'default',
    speed: 'normal',
    direction: 'left',
  },
});

export interface InfiniteScrollerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof infiniteScrollerVariants> {
  pauseOnHover?: boolean;
}

const InfiniteScroller = React.forwardRef<HTMLDivElement, InfiniteScrollerProps>(
  ({ className, variant, speed, direction, pauseOnHover = true, children, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);
    const [start, setStart] = React.useState(false);

    // Merge refs
    React.useImperativeHandle(ref, () => containerRef.current!);

    const addAnimation = React.useCallback(() => {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        // Duplicate items for seamless scroll
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        setStart(true);
      }
    }, []);

    React.useEffect(() => {
      addAnimation();
    }, [addAnimation]);

    return (
      <div
        ref={containerRef}
        className={cn(infiniteScrollerVariants({ variant, speed, direction }), className)}
        {...props}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
            start && 'animate-scroll',
            pauseOnHover && 'hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </ul>
      </div>
    );
  },
);
InfiniteScroller.displayName = 'InfiniteScroller';

export { InfiniteScroller, infiniteScrollerVariants };
