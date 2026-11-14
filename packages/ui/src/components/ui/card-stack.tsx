'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const cardStackVariants = cva('relative', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

const cardStyles: Record<string, string> = {
  default: 'border border-border bg-background rounded-card',
  glass: 'glass rounded-card',
  cyber: 'border border-signal/20 bg-panel rounded-card',
};

export interface CardStackProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof cardStackVariants> {
  cards: React.ReactNode[];
  offset?: number;
  rotation?: number;
  onSwipe?: (index: number) => void;
  /** Name of the keyboard control that shows the next card. */
  nextLabel?: string;
}

const CardStack = React.forwardRef<HTMLDivElement, CardStackProps>(
  (
    {
      className,
      variant = 'default',
      cards,
      offset = 8,
      rotation = 3,
      onSwipe,
      nextLabel = 'Next card',
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const [current, setCurrent] = React.useState(0);
    const visibleCount = Math.min(3, cards.length);

    const cycle = () => {
      const next = (current + 1) % cards.length;
      setCurrent(next);
      onSwipe?.(next);
    };

    return (
      <div ref={ref} className={cn(cardStackVariants({ variant }), className)} {...props}>
        <div className="relative" style={{ height: 'auto' }}>
          {Array.from({ length: visibleCount }, (_, stackIdx) => {
            const cardIdx = (current + stackIdx) % cards.length;
            const isTop = stackIdx === 0;
            const yOffset = stackIdx * offset;
            const rot = stackIdx * rotation * (stackIdx % 2 === 0 ? 1 : -1);
            const scale = 1 - stackIdx * 0.04;

            return (
              <div
                key={cardIdx}
                className={cn(
                  cardStyles[v],
                  'overflow-hidden transition-transform duration-(--motion-base)',
                  !isTop && 'absolute inset-x-0 top-0',
                  isTop && 'relative cursor-pointer',
                )}
                style={{
                  transform: `translateY(${yOffset}px) rotate(${rot}deg) scale(${scale})`,
                  zIndex: visibleCount - stackIdx,
                }}
                onClick={isTop ? cycle : undefined}
              >
                {cards[cardIdx]}
              </div>
            );
          })}
        </div>
        {/* Clicking the top card cycles the stack; this is the same action for keyboard users. */}
        {cards.length > 1 && (
          <button
            type="button"
            onClick={cycle}
            className="bg-panel text-foreground border-rule rounded-control focus-visible:outline-signal sr-only z-(--z-dock) border px-2 py-1 text-xs focus-visible:not-sr-only focus-visible:absolute focus-visible:right-2 focus-visible:bottom-2 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid"
          >
            {nextLabel}
          </button>
        )}
        <span role="status" className="sr-only">
          Card {current + 1} of {cards.length}
        </span>
      </div>
    );
  },
);
CardStack.displayName = 'CardStack';

export { CardStack, cardStackVariants };
