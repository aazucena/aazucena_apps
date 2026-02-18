'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const signaturePadVariants = cva(
  'flex flex-col gap-2 rounded-md border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-border',
        glass: 'glass border-border/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface SignaturePadProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onSave'>,
    VariantProps<typeof signaturePadVariants> {
  onSave?: (dataUrl: string) => void;
  strokeColor?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  clearLabel?: string;
  saveLabel?: string;
}

const SignaturePad = React.forwardRef<HTMLDivElement, SignaturePadProps>(
  (
    {
      className,
      variant,
      onSave,
      strokeColor = 'currentColor',
      strokeWidth = 2,
      width = 400,
      height = 200,
      clearLabel = 'Clear',
      saveLabel = 'Save',
      ...props
    },
    ref,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const drawing = React.useRef(false);

    const getCtx = () => canvasRef.current?.getContext('2d') ?? null;

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const point = 'touches' in e ? e.touches[0]! : e;
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    };

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
      const ctx = getCtx();
      if (!ctx) return;
      drawing.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!drawing.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const { x, y } = getPos(e);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const endDraw = () => {
      drawing.current = false;
    };

    const clear = () => {
      const ctx = getCtx();
      if (ctx) ctx.clearRect(0, 0, width, height);
    };

    const save = () => {
      if (canvasRef.current) onSave?.(canvasRef.current.toDataURL('image/png'));
    };

    return (
      <div ref={ref} className={cn(signaturePadVariants({ variant }), 'p-3', className)} {...props}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-border/50 cursor-crosshair rounded border border-dashed"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clear}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-3 py-1.5 text-sm font-medium"
          >
            {clearLabel}
          </button>
          <button
            type="button"
            onClick={save}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    );
  },
);
SignaturePad.displayName = 'SignaturePad';

export { SignaturePad, signaturePadVariants };
