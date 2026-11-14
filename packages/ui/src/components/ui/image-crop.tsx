'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const imageCropVariants = cva(
  'relative inline-block select-none overflow-hidden rounded-control border',
  {
    variants: {
      variant: {
        default: 'border-border',
        glass: 'border-border/20',
        cyber: 'border-signal/30',
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
    const descId = React.useId();
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
        const next = { ...prev };

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

    // Keyboard: arrow keys move the crop area, or resize it from a focused corner.
    // Shift makes a larger step. Values are percentages of the image.
    const handleKeyDown = (e: React.KeyboardEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
      const dir: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const d = dir[e.key];
      if (!d) return;
      e.preventDefault();
      e.stopPropagation();
      const stepSize = e.shiftKey ? 10 : 1;
      const dx = d[0] * stepSize;
      const dy = d[1] * stepSize;
      const rect = containerRef.current?.getBoundingClientRect();
      const minW = rect?.width ? (minWidth / rect.width) * 100 : 5;
      const minH = rect?.height ? (minHeight / rect.height) * 100 : 5;
      const prev = crop;
      const next = { ...prev };
      if (type === 'move') {
        next.x = clamp(prev.x + dx, 0, 100 - prev.width);
        next.y = clamp(prev.y + dy, 0, 100 - prev.height);
      } else {
        if (type.includes('w')) {
          const newX = clamp(prev.x + dx, 0, prev.x + prev.width - minW);
          next.width = prev.width - (newX - prev.x);
          next.x = newX;
        }
        if (type.includes('e')) next.width = clamp(prev.width + dx, minW, 100 - prev.x);
        if (type.includes('n')) {
          const newY = clamp(prev.y + dy, 0, prev.y + prev.height - minH);
          next.height = prev.height - (newY - prev.y);
          next.y = newY;
        }
        if (type.includes('s')) next.height = clamp(prev.height + dy, minH, 100 - prev.y);
        if (aspect) next.height = next.width / aspect;
      }
      setCrop(next);
      onCropChange?.(next);
      onCropComplete?.(next);
    };

    const describe = `${Math.round(crop.width)}% wide, ${Math.round(crop.height)}% tall, ${Math.round(crop.x)}% from the left, ${Math.round(crop.y)}% from the top`;
    const focusRing =
      'focus-visible:outline-signal focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid';
    const handleStyle = cn(
      'absolute h-3 w-3 rounded-full border-2 border-rule bg-primary',
      // A 24px hit area around the 12px dot (WCAG 2.5.8).
      'before:absolute before:-inset-1.5 before:content-[""]',
      focusRing,
    );
    const corners = [
      ['nw', 'Top left', '-top-1.5 -left-1.5 cursor-nw-resize'],
      ['ne', 'Top right', '-top-1.5 -right-1.5 cursor-ne-resize'],
      ['sw', 'Bottom left', '-bottom-1.5 -left-1.5 cursor-sw-resize'],
      ['se', 'Bottom right', '-right-1.5 -bottom-1.5 cursor-se-resize'],
    ] as const;

    return (
      <div ref={ref} className={cn(imageCropVariants({ variant }), className)} {...props}>
        <div ref={containerRef} className="relative">
          <img src={src} alt="" className="block w-full" draggable={false} />
          {/* Overlay */}
          <div
            className="bg-scrim absolute inset-0"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x}% ${crop.y}%, ${crop.x}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y + crop.height}%, ${crop.x + crop.width}% ${crop.y}%, ${crop.x}% ${crop.y}%)`,
            }}
          />
          {/* Crop area */}
          <div
            role="group"
            tabIndex={0}
            aria-label="Crop area. Use the arrow keys to move it"
            aria-roledescription="movable crop area"
            aria-describedby={descId}
            className={cn('border-rule absolute cursor-move border-2', focusRing)}
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
            onKeyDown={(e) => handleKeyDown(e, 'move')}
          >
            {corners.map(([type, name, position]) => (
              <button
                key={type}
                type="button"
                aria-label={`${name} corner. Use the arrow keys to resize`}
                className={cn(handleStyle, position)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, type);
                }}
                onKeyDown={(e) => handleKeyDown(e, type)}
              />
            ))}
          </div>
          <span id={descId} role="status" className="sr-only">
            {describe}
          </span>
        </div>
      </div>
    );
  },
);
ImageCrop.displayName = 'ImageCrop';

export { ImageCrop, imageCropVariants };
