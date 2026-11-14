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
  default: 'border-input bg-background hover:bg-state focus:ring-2 focus:ring-ring',
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

    // The search field takes focus when the list opens.
    React.useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);

    const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

    // Arrow keys move a virtual cursor through the options (aria-activedescendant);
    // focus stays in the text field so typing keeps filtering.
    const [active, setActive] = React.useState(-1);
    const move = (to: number) => {
      const enabled = filtered.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
      if (!enabled.length) return setActive(-1);
      const pos = enabled.indexOf(active);
      const next =
        to === Infinity
          ? enabled[enabled.length - 1]!
          : to === -Infinity
            ? enabled[0]!
            : enabled[(pos + to + enabled.length) % enabled.length]!;
      setActive(pos === -1 && to === -1 ? enabled[enabled.length - 1]! : next);
    };
    React.useEffect(() => {
      if (active >= 0)
        document.getElementById(`${listboxId}-${active}`)?.scrollIntoView({ block: 'nearest' });
    }, [active, listboxId]);

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const close = (refocus = true) => {
      setOpen(false);
      setQuery('');
      setActive(-1);
      if (refocus) triggerRef.current?.focus();
    };
    const choose = (option: ComboboxOption) => {
      if (option.disabled) return;
      onChange?.(option.value);
      setSelected(option);
      close();
    };
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          move(1);
          break;
        case 'ArrowUp':
          move(-1);
          break;
        case 'Home':
          move(-Infinity);
          break;
        case 'End':
          move(Infinity);
          break;
        case 'Enter':
          if (active >= 0 && filtered[active]) choose(filtered[active]!);
          break;
        case 'Escape':
          close();
          break;
        case 'Tab':
          close(false);
          return;
        default:
          return;
      }
      e.preventDefault();
    };

    return (
      <div ref={ref} className={cn(comboboxVariants({ variant, size }), className)} {...props}>
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel ?? placeholder}
          aria-controls={open ? listboxId : undefined}
          disabled={disabled}
          onClick={() => (open ? close() : setOpen(true))}
          onKeyDown={(e) => {
            if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          className={cn(
            'rounded-control focus-visible:outline-signal flex w-full items-center justify-between border transition-opacity focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid',
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
            aria-hidden="true"
            className={cn('shrink-0 transition-transform', open && 'rotate-180')}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            className={cn(
              'rounded-control absolute z-(--z-dropdown) mt-1 w-full border',
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
                aria-label="Search options"
                aria-controls={listboxId}
                aria-activedescendant={active >= 0 ? `${listboxId}-${active}` : undefined}
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(-1);
                }}
                onKeyDown={handleSearchKeyDown}
                className={cn(
                  'placeholder:text-muted-foreground focus-visible:outline-signal w-full rounded border-none bg-transparent px-2 py-1 text-sm focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid',
                  v === 'cyber' && 'text-signal font-mono',
                )}
              />
            </div>
            <div
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel ?? placeholder}
              className="max-h-48 overflow-auto p-1"
            >
              {filtered.length === 0 ? (
                <p role="status" className="text-muted-foreground px-2 py-1.5 text-center text-xs">
                  {emptyMessage}
                </p>
              ) : (
                filtered.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={value === option.value}
                    aria-disabled={option.disabled || undefined}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                      option.disabled && 'pointer-events-none opacity-50',
                      value === option.value
                        ? v === 'cyber'
                          ? 'bg-signal/10 text-signal'
                          : 'bg-accent text-accent-foreground'
                        : v === 'cyber'
                          ? 'text-signal'
                          : '',
                      // The option the arrow keys are on (aria-activedescendant).
                      index === active &&
                        value !== option.value &&
                        (v === 'cyber' ? 'bg-signal/10' : 'bg-state'),
                      index === active &&
                        'outline-signal outline-1 -outline-offset-1 outline-solid',
                    )}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                      className={cn('shrink-0', value !== option.value && 'invisible')}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {option.label}
                  </div>
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
