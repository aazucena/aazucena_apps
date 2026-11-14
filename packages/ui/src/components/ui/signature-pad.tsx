'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const signaturePadVariants = cva('flex flex-col gap-2 rounded-control border', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      glass: 'glass border-border/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30',
    },
  },
  defaultVariants: { variant: 'default' },
});

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
  /**
   * Offer a typed name as an alternative to drawing, for people who can't use a
   * pointer. The typed name is drawn onto the canvas, so `onSave` still gets an image.
   */
  allowTyped?: boolean;
  typedLabel?: string;
  /** Accessible name of the drawing area. */
  label?: string;
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
      allowTyped = true,
      typedLabel = 'Or type your name',
      label = 'Signature',
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

    const [typed, setTyped] = React.useState('');
    const typedId = React.useId();

    const clear = () => {
      const ctx = getCtx();
      if (ctx) ctx.clearRect(0, 0, width, height);
      setTyped('');
    };

    const drawTyped = (name: string) => {
      setTyped(name);
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      if (!name) return;
      ctx.fillStyle = strokeColor === 'currentColor' ? getComputedStyle(canvas).color : strokeColor;
      const fontSize = Math.min(height * 0.4, (width * 1.6) / Math.max(name.length, 6));
      ctx.font = `italic ${fontSize}px cursive`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, width / 2, height / 2, width - 24);
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
          role="img"
          aria-label={typed ? `${label}: ${typed}` : label}
          className="border-border/50 cursor-crosshair rounded border border-dashed"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {allowTyped && (
          <div className="flex flex-col gap-1">
            <label htmlFor={typedId} className="text-muted-foreground text-xs">
              {typedLabel}
            </label>
            <input
              id={typedId}
              type="text"
              value={typed}
              autoComplete="name"
              onChange={(e) => drawTyped(e.target.value)}
              className="border-input bg-background rounded-control h-control focus-visible:outline-signal border px-3 text-sm focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clear}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-control px-3 py-1.5 text-sm font-medium"
          >
            {clearLabel}
          </button>
          <button
            type="button"
            onClick={save}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-control px-3 py-1.5 text-sm font-medium"
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
