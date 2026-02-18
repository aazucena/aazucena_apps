'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const colorPickerVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'gap-1.5 text-xs',
      md: 'gap-2 text-sm',
      lg: 'gap-3 text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const inputStyles: Record<string, string> = {
  default:
    'border-input bg-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2',
  glass: 'glass-m border-white/10 placeholder:text-white/40',
  cyber:
    'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono placeholder:text-cyan-500/30 focus:border-cyan-400',
};

const sizeMap: Record<string, { swatch: string; input: string }> = {
  sm: { swatch: 'h-8 w-8', input: 'h-8 px-2' },
  md: { swatch: 'h-9 w-9', input: 'h-9 px-3' },
  lg: { swatch: 'h-10 w-10', input: 'h-10 px-4' },
};

const DEFAULT_SWATCHES = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#000000',
  '#ffffff',
];

export interface ColorPickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof colorPickerVariants> {
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
  swatches?: string[];
  showInput?: boolean;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value = '#3b82f6',
      onChange,
      disabled,
      swatches = DEFAULT_SWATCHES,
      showInput = true,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'md';
    const [showSwatches, setShowSwatches] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setShowSwatches(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
      <div ref={ref} className={cn(colorPickerVariants({ variant, size }), className)} {...props}>
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            onClick={() => setShowSwatches((p) => !p)}
            disabled={disabled}
            className={cn(
              'rounded-md border shadow-sm transition-all',
              sizeMap[s]?.swatch,
              v === 'cyber' ? 'border-cyan-500/30' : 'border-input',
              disabled && 'pointer-events-none opacity-50',
            )}
            style={{ backgroundColor: value }}
            aria-label="Choose color"
          />

          {showSwatches && (
            <div
              className={cn(
                'absolute top-full left-0 z-50 mt-1 grid grid-cols-5 gap-1 rounded-lg border p-2 shadow-xl',
                v === 'glass' && 'glass',
                v === 'cyber' ? 'border-cyan-500/30 bg-gray-950' : 'bg-popover',
              )}
            >
              {swatches.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange?.(c);
                    setShowSwatches(false);
                  }}
                  className={cn(
                    'h-6 w-6 rounded-sm border transition-all hover:scale-110',
                    c === value ? 'ring-ring ring-2 ring-offset-2' : 'border-transparent',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
              ))}
              {/* Native picker */}
              <label className="border-muted-foreground/40 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border border-dashed">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="sr-only"
                />
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </label>
            </div>
          )}
        </div>

        {showInput && (
          <input
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              'w-24 rounded-md border transition-all outline-none',
              inputStyles[v],
              sizeMap[s]?.input,
              disabled && 'pointer-events-none opacity-50',
            )}
          />
        )}
      </div>
    );
  },
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker, colorPickerVariants };
