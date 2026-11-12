'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const comboboxVariants = cva('relative w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const triggerClasses: Record<string, string> = {
  default: 'border-input bg-background hover:bg-accent focus:ring-2 focus:ring-ring',
  glass: 'glass border-rule hover:border-rule',
  cyber: 'border-signal/30 bg-panel text-signal font-mono hover:border-signal',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof comboboxVariants> {
  options: ComboboxOption[];
  value?: string;
  placeholder?: string;
  emptyMessage?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      options,
      value,
      placeholder = 'Select...',
      emptyMessage = 'No results.',
      onChange,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [selected, setSelected] = React.useState<ComboboxOption>();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listboxId = React.useId();
    const v = variant ?? 'default';
    const s = size ?? 'md';

    const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

    // const selected = options.find((o) => o.value === value);

    return (
      <div ref={ref} className={cn(comboboxVariants({ variant, size }), className)} {...props}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel ?? placeholder}
          aria-controls={open ? listboxId : undefined}
          disabled={disabled}
          onClick={() => {
            setOpen(!open);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={cn(
            'rounded-control flex w-full items-center justify-between border transition-all outline-none',
            triggerClasses[v],
            sizeClasses[s],
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          <span className={cn(!selected && 'text-muted-foreground')}>
            {selected?.label ?? placeholder}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn('shrink-0 transition-transform', open && 'rotate-180')}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            id={listboxId}
            role="listbox"
            className={cn(
              'rounded-control absolute z-50 mt-1 w-full border',
              v === 'cyber'
                ? 'border-signal/30 bg-panel'
                : v === 'glass'
                  ? 'glass border-rule'
                  : 'border-border bg-popover',
            )}
          >
            <div className="p-1.5">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  'placeholder:text-muted-foreground w-full rounded border-none bg-transparent px-2 py-1 text-sm outline-none',
                  v === 'cyber' && 'text-signal font-mono',
                )}
              />
            </div>
            <div className="max-h-48 overflow-auto p-1">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground px-2 py-1.5 text-center text-xs">
                  {emptyMessage}
                </p>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    disabled={option.disabled}
                    onClick={() => {
                      onChange?.(option.value);
                      setSelected(option);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                      option.disabled && 'pointer-events-none opacity-50',
                      value === option.value
                        ? v === 'cyber'
                          ? 'bg-signal/20 text-signal'
                          : 'bg-accent text-accent-foreground'
                        : v === 'cyber'
                          ? 'text-signal hover:bg-signal/10'
                          : 'hover:bg-accent',
                    )}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={cn('shrink-0', value !== option.value && 'invisible')}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
Combobox.displayName = 'Combobox';

export { Combobox, comboboxVariants };
