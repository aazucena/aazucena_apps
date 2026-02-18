'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const marqueeVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface MarqueeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marqueeVariants> {
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: string;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      variant,
      speed = 30,
      direction = 'left',
      pauseOnHover = true,
      gap = '1rem',
      children,
      ...props
    },
    ref,
  ) => {
    const animDir = direction === 'left' ? 'normal' : 'reverse';
    const dur = `${speed}s`;

    return (
      <div
        ref={ref}
        className={cn(marqueeVariants({ variant }), className)}
        {...props}
      >
        <style>{`
          @keyframes az-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className={cn(
            'flex w-max',
            pauseOnHover && 'hover:[animation-play-state:paused]',
          )}
          style={{
            animation: `az-marquee ${dur} linear infinite`,
            animationDirection: animDir,
            gap,
          }}
        >
          {/* Original */}
          <div className="flex shrink-0" style={{ gap }}>
            {children}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0" style={{ gap }} aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Marquee.displayName = 'Marquee';

export { Marquee, marqueeVariants };
