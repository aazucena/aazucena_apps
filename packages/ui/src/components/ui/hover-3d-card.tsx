'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const hover3dCardVariants = cva('overflow-hidden rounded-xl transition-shadow', {
  variants: {
    variant: {
      default: 'border border-border bg-background shadow-sm hover:shadow-lg',
      glass: 'glass hover:shadow-lg',
      cyber: 'border border-cyan-500/20 bg-black/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface Hover3DCardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof hover3dCardVariants> {
  intensity?: number;
  glare?: boolean;
  perspective?: number;
}

const Hover3DCard = React.forwardRef<HTMLDivElement, Hover3DCardProps>(
  (
    {
      className,
      variant,
      intensity = 10,
      glare = false,
      perspective = 1000,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [transform, setTransform] = React.useState('');
    const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = innerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      if (glare) setGlarePos({ x: x * 100, y: y * 100 });
    };

    const handleLeave = () => {
      setTransform('');
    };

    return (
      <div
        ref={(node) => {
          (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(hover3dCardVariants({ variant }), 'relative', className)}
        style={{
          ...style,
          transform: transform || undefined,
          transition: transform ? 'none' : 'transform 0.4s ease-out',
          willChange: 'transform',
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...props}
      >
        {children}
        {glare && transform && (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    );
  },
);
Hover3DCard.displayName = 'Hover3DCard';

export { Hover3DCard, hover3dCardVariants };
