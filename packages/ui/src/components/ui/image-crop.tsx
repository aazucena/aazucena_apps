'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const imageCropVariants = cva(
  'relative inline-block select-none overflow-hidden rounded-md border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border',
        glass: 'border-border/20 shadow-2xl',
        cyber: 'border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCropProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof imageCropVariants> {
  src: string;
  aspect?: number;
  onCropChange?: (crop: CropArea) => void;
  onCropComplete?: (crop: CropArea) => void;
  minWidth?: number;
  minHeight?: number;
}

const ImageCrop = React.forwardRef<HTMLDivElement, ImageCropProps>(
  (
    {
      className,
      variant,
      src,
      aspect,
      onCropChange,
      onCropComplete,
      minWidth = 50,
      minHeight = 50,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [crop, setCrop] = React.useState<CropArea>({ x: 10, y: 10, width: 80, height: 80 });
    const dragging = React.useRef<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
    const startPos = React.useRef({ mx: 0, my: 0, crop: crop });

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
      e.preventDefault();
      dragging.current = type;
      startPos.current = { mx: e.clientX, my: e.clientY, crop: { ...crop } };

      const handleMove = (ev: MouseEvent) => {
        const cont = containerRef.current;
        if (!cont || !dragging.current) return;
        const rect = cont.getBoundingClientRect();
        const dx = ((ev.clientX - startPos.current.mx) / rect.width) * 100;
        const dy = ((ev.clientY - startPos.current.my) / rect.height) * 100;
        const prev = startPos.current.crop;
        let next = { ...prev };

        if (dragging.current === 'move') {
          next.x = clamp(prev.x + dx, 0, 100 - prev.width);
          next.y = clamp(prev.y + dy, 0, 100 - prev.height);
        } else {
          const minW = (minWidth / rect.width) * 100;
          const minH = (minHeight / rect.height) * 100;
          if (dragging.current.includes('w')) {
            const newX = clamp(prev.x + dx, 0, prev.x + prev.width - minW);
            next.width = prev.width - (newX - prev.x);
            next.x = newX;
          }
          if (dragging.current.includes('e')) {
            next.width = clamp(prev.width + dx, minW, 100 - prev.x);
          }
          if (dragging.current.includes('n')) {
            const newY = clamp(prev.y + dy, 0, prev.y + prev.height - minH);
            next.height = prev.height - (newY - prev.y);
            next.y = newY;
          }
          if (dragging.current.includes('s')) {
            next.height = clamp(prev.height + dy, minH, 100 - prev.y);
          }
          if (aspect) {
            next.height = next.width / aspect;
          }
        }

        setCrop(next);
        onCropChange?.(next);
      };

      const handleUp = () => {
        dragging.current = null;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        onCropComplete?.(crop);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    };

    const handleStyle = 'absolute h-3 w-3 rounded-full border-2 border-white bg-primary shadow';

    return (
      <div ref={ref} className={cn(imageCropVariants({ variant }), className)} {...props}>
        <div ref={containerRef} className="relative">
          <img src={src} alt="" className="block w-full" draggable={false} />
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x}% ${crop.y}%, ${crop.x}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y}%, ${crop.x}% ${crop.y}%)`,
            }}
          />
          {/* Crop area */}
          <div
            className="absolute cursor-move border-2 border-white/80"
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
          >
            <div
              className={cn(handleStyle, '-top-1.5 -left-1.5 cursor-nw-resize')}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'nw');
              }}
            />
            <div
              className={cn(handleStyle, '-top-1.5 -right-1.5 cursor-ne-resize')}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'ne');
              }}
            />
            <div
              className={cn(handleStyle, '-bottom-1.5 -left-1.5 cursor-sw-resize')}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'sw');
              }}
            />
            <div
              className={cn(handleStyle, '-right-1.5 -bottom-1.5 cursor-se-resize')}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, 'se');
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);
ImageCrop.displayName = 'ImageCrop';

export { ImageCrop, imageCropVariants };
