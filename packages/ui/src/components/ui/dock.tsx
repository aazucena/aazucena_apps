'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const dockVariants = cva('flex items-center gap-2 rounded-2xl border p-2 transition-all', {
  variants: {
    variant: {
      default: 'bg-background/80 border-border backdrop-blur-md shadow-lg',
      glass: 'glass-m border-white/10 shadow-xl',
      cyber:
        'bg-black/80 border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    position: {
      bottom: 'flex-row',
      top: 'flex-row',
      left: 'flex-col',
      right: 'flex-col',
    },
  },
  defaultVariants: { variant: 'default', position: 'bottom' },
});

export interface DockProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dockVariants> {
  magnification?: number;
  distance?: number;
}

export interface DockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

const DockContext = React.createContext<{
  magnification: number;
  distance: number;
  mousePos: { x: number; y: number } | null;
  variant: string;
}>({ magnification: 1.5, distance: 100, mousePos: null, variant: 'default' });

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      variant = 'default',
      position,
      magnification = 1.5,
      distance = 100,
      children,
      ...props
    },
    ref,
  ) => {
    const [mousePos, setMousePos] = React.useState<{ x: number; y: number } | null>(null);
    const dockRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!dockRef.current) return;
      const rect = dockRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => setMousePos(null);

    return (
      <DockContext.Provider
        value={{ magnification, distance, mousePos, variant: variant ?? 'default' }}
      >
        <div
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            (dockRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(dockVariants({ variant, position }), className)}
          {...props}
        >
          {children}
        </div>
      </DockContext.Provider>
    );
  },
);
Dock.displayName = 'Dock';

const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(
  ({ className, label, children, ...props }, ref) => {
    const { magnification, distance, mousePos, variant } = React.useContext(DockContext);
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(1);

    React.useEffect(() => {
      if (!mousePos || !itemRef.current) {
        setScale(1);
        return;
      }
      const rect = itemRef.current.getBoundingClientRect();
      const parentRect = itemRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const itemCenterX = rect.left - parentRect.left + rect.width / 2;
      const dist = Math.abs(mousePos.x - itemCenterX);
      const s = dist < distance ? 1 + (magnification - 1) * (1 - dist / distance) : 1;
      setScale(s);
    }, [mousePos, magnification, distance]);

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(
          'relative flex size-10 cursor-pointer items-center justify-center rounded-xl transition-transform duration-150 [&_svg]:size-5',
          variant === 'cyber'
            ? 'text-cyan-400 hover:bg-cyan-500/10'
            : variant === 'glass'
              ? 'hover:bg-white/10'
              : 'hover:bg-accent',
          className,
        )}
        style={{ transform: `scale(${scale})` }}
        {...props}
      >
        {children}
        {label && (
          <span
            className={cn(
              'pointer-events-none absolute -top-8 rounded px-1.5 py-0.5 text-xs whitespace-nowrap opacity-0 transition-opacity',
              scale > 1.1 && 'opacity-100',
              variant === 'cyber'
                ? 'border border-cyan-500/30 bg-black/90 text-cyan-400'
                : 'bg-popover text-popover-foreground border shadow-sm',
            )}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);
DockItem.displayName = 'DockItem';

export { Dock, DockItem, dockVariants };
