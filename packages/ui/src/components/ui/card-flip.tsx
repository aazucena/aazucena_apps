'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const cardFlipVariants = cva('relative w-64 h-40 preserve-3d', {
  variants: {
    variant: {
      default: '',
      glass: 'text-foreground',
      cyber: 'font-mono text-signal',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardFlipProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardFlipVariants> {
  front: React.ReactNode;
  back: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  duration?: number; // in ms
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  flipOnHover?: boolean;
  perspective?: number;
}

const CardFlip = React.forwardRef<HTMLDivElement, CardFlipProps>(
  (
    {
      className,
      variant,
      front,
      back,
      direction = 'horizontal',
      duration = 600,
      flipped: controlledFlipped,
      onFlip,
      flipOnHover = false,
      perspective = 1000,
      ...props
    },
    ref,
  ) => {
    const [internalFlipped, setInternalFlipped] = React.useState(false);
    const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

    const handleFlip = () => {
      if (controlledFlipped === undefined) {
        setInternalFlipped((prev) => !prev);
      }
      onFlip?.(!isFlipped);
    };

    const containerStyle: React.CSSProperties = {
      perspective: perspective + 'px',
    };

    const cardStyle: React.CSSProperties = {
      transition: `transform ${duration}ms`,
      transformStyle: 'preserve-3d',
      transform: isFlipped
        ? direction === 'horizontal'
          ? 'rotateY(180deg)'
          : 'rotateX(180deg)'
        : 'none',
    };

    const commonFaceStyle: React.CSSProperties = {
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden', // For Safari
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };

    return (
      <div
        ref={ref}
        className={cn(cardFlipVariants({ variant }), className)}
        style={containerStyle}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={cardStyle}
          onClick={!flipOnHover ? handleFlip : undefined}
          onMouseEnter={flipOnHover ? () => handleFlip() : undefined}
          onMouseLeave={flipOnHover ? () => handleFlip() : undefined}
        >
          {/* Front Face */}
          <div
            className={cn(
              'front-face rounded-control absolute h-full w-full',
              variant === 'glass'
                ? 'border-rule bg-state'
                : variant === 'cyber'
                  ? 'border-signal/20 bg-background'
                  : 'bg-card border-border border',
            )}
            style={commonFaceStyle}
          >
            {front}
          </div>

          {/* Back Face */}
          <div
            className={cn(
              'back-face rounded-control absolute h-full w-full',
              variant === 'glass'
                ? 'border-rule bg-state'
                : variant === 'cyber'
                  ? 'border-signal/20 bg-background'
                  : 'bg-card border-border border',
            )}
            style={{
              ...commonFaceStyle,
              transform: direction === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)',
            }}
          >
            {back}
          </div>
        </div>
      </div>
    );
  },
);

CardFlip.displayName = 'CardFlip';

export { CardFlip, cardFlipVariants };
