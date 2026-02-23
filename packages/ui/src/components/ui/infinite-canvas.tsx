'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const infiniteCanvasVariants = cva(
  'relative overflow-hidden rounded-lg border flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-muted/30 border-border',
        glass: 'bg-white/5 border-white/10 text-white backdrop-blur-md',
        cyber: 'bg-black border-cyan-500/20 text-cyan-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InfiniteCanvasProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infiniteCanvasVariants> {
  width: number;
  height: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  initialPanX?: number;
  initialPanY?: number;
  onViewportChange?: (viewport: { zoom: number; panX: number; panY: number }) => void;
  renderContent: (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => void;
}

const InfiniteCanvas = React.forwardRef<HTMLDivElement, InfiniteCanvasProps>(
  (
    {
      className,
      variant,
      width,
      height,
      minZoom = 0.1,
      maxZoom = 4,
      initialZoom = 1,
      initialPanX = 0,
      initialPanY = 0,
      onViewportChange,
      renderContent,
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = React.useState(initialZoom);
    const [panX, setPanX] = React.useState(initialPanX);
    const [panY, setPanY] = React.useState(initialPanY);

    const isPanning = React.useRef(false);
    const lastPanX = React.useRef(0);
    const lastPanY = React.useRef(0);

    // Debounce viewport changes callback
    const debouncedOnViewportChange = React.useCallback(
      (newViewport: { zoom: number; panX: number; panY: number }) => {
        if (onViewportChange) {
          // Use a debounce function here if onViewportChange is expensive
          // For now, direct call
          onViewportChange(newViewport);
        }
      },
      [onViewportChange],
    );

    React.useEffect(() => {
      debouncedOnViewportChange({ zoom, panX, panY });
    }, [zoom, panX, panY, debouncedOnViewportChange]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      renderContent(ctx, zoom, panX, panY);

      ctx.restore();
    }, [zoom, panX, panY, renderContent, width, height]);

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
      isPanning.current = true;
      lastPanX.current = e.clientX;
      lastPanY.current = e.clientY;
    }, []);

    const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
      if (isPanning.current) {
        const dx = e.clientX - lastPanX.current;
        const dy = e.clientY - lastPanY.current;
        setPanX((prev) => prev + dx);
        setPanY((prev) => prev + dy);
        lastPanX.current = e.clientX;
        lastPanY.current = e.clientY;
      }
    }, []);

    const handleMouseUp = React.useCallback(() => {
      isPanning.current = false;
    }, []);

    const handleMouseLeave = React.useCallback(() => {
      isPanning.current = false;
    }, []);

    const handleWheel = React.useCallback((e: React.WheelEvent) => {
      e.preventDefault();
      const scaleAmount = 1.1;
      const mouseX = e.clientX - canvasRef.current!.getBoundingClientRect().left;
      const mouseY = e.clientY - canvasRef.current!.getBoundingClientRect().top;

      const newZoom = e.deltaY < 0 ? zoom * scaleAmount : zoom / scaleAmount;
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

      // Calculate new pan to zoom around mouse position
      const newPanX = mouseX - (mouseX - panX) * (clampedZoom / zoom);
      const newPanY = mouseY - (mouseY - panY) * (clampedZoom / zoom);

      setZoom(clampedZoom);
      setPanX(newPanX);
      setPanY(newPanY);
    }, [zoom, panX, panY, minZoom, maxZoom]);

    return (
      <div
        ref={ref}
        className={cn(infiniteCanvasVariants({ variant }), className)}
        style={{ width, height }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          className="block touch-none"
        />
        {/* Render children as overlay for interactive elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Children can be rendered here, positioned relative to canvas coordinates */}
          {/* For example, if you pass React components, you can position them based on pan/zoom */}
        </div>
      </div>
    );
  },
);
InfiniteCanvas.displayName = 'InfiniteCanvas';

export { InfiniteCanvas, infiniteCanvasVariants };
