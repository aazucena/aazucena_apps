'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Input } from './input';
import { Label } from './label';
import { Paint, Plus } from '@aazucena/icons';

const colorPickerVariants = cva('inline-flex items-center gap-2', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const swatchVariants = cva(
  'rounded-md border shadow-sm transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-9 w-9',
        lg: 'h-10 w-10',
      },
      variant: {
        default: 'border-input',
        glass: 'glass-m border-white/20',
        cyber: 'border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

const DEFAULT_SWATCHES = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#f43f5e',
  '#71717a',
  '#000000',
  '#ffffff',
  '#transparent',
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
    const nativePickerId = React.useId();

    const handleColorChange = (newColor: string) => {
      onChange?.(newColor);
    };

    return (
      <div ref={ref} className={cn(colorPickerVariants({ variant, size }), className)} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={cn(swatchVariants({ variant: v, size: s }))}
              style={{
                backgroundColor: value === 'transparent' ? 'transparent' : value,
                backgroundImage:
                  value === 'transparent'
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                    : undefined,
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              }}
              aria-label="Choose color"
            />
          </PopoverTrigger>
          <PopoverContent variant={v} className="bg-background w-64 space-y-4 p-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Presets
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {swatches.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleColorChange(c)}
                    className={cn(
                      'group relative h-8 w-8 rounded-md border transition-all hover:scale-110 active:scale-95',
                      c === value
                        ? 'ring-primary ring-2 ring-offset-2'
                        : 'border-border/50 hover:border-primary/50',
                    )}
                    style={{
                      backgroundColor: c === 'transparent' ? 'transparent' : c,
                      backgroundImage:
                        c === 'transparent'
                          ? 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)'
                          : undefined,
                      backgroundSize: '8px 8px',
                    }}
                    title={c}
                  >
                    {c === value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            c === '#ffffff' || c === 'transparent' ? 'bg-black' : 'bg-white',
                          )}
                        />
                      </div>
                    )}
                  </button>
                ))}

                {/* Custom Color Trigger */}
                <label
                  htmlFor={nativePickerId}
                  className="border-muted-foreground/40 hover:border-primary hover:bg-muted/50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-dashed transition-all"
                  title="Custom Color"
                >
                  <Plus className="text-muted-foreground h-4 w-4" />
                  <input
                    id={nativePickerId}
                    type="color"
                    value={value.startsWith('#') ? value : '#000000'}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="hex-input"
                  className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase"
                >
                  HEX Code
                </Label>
                <Paint className="text-muted-foreground h-3 w-3" />
              </div>
              <div className="flex gap-2">
                <div
                  className="h-9 w-9 shrink-0 rounded-md border"
                  style={{ backgroundColor: value }}
                />
                <Input
                  id="hex-input"
                  variant={v}
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                  placeholder="#000000"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {showInput && (
          <Input
            variant={v}
            value={value}
            disabled={disabled}
            onChange={(e) => handleColorChange(e.target.value)}
            className={cn(
              'w-28 font-mono text-xs uppercase',
              v === 'cyber' ? 'h-9' : '',
              size === 'sm' && 'h-8 w-24',
              size === 'lg' && 'h-10 w-32',
            )}
          />
        )}
      </div>
    );
  },
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker, colorPickerVariants };
