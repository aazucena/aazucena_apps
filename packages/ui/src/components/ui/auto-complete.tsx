'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const autoCompleteVariants = cva('relative w-full', {
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
  default:
    'border-input bg-background hover:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-2',
  glass: 'glass-m border-white/10 hover:border-white/20',
  cyber:
    'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono hover:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

export interface AutoCompleteOption {
  value: string;
  label: string;
}

export interface AutoCompleteProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof autoCompleteVariants> {
  options: AutoCompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  freeSolo?: boolean;
  disabled?: boolean;
}

const AutoComplete = React.forwardRef<HTMLDivElement, AutoCompleteProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      options,
      value,
      onChange,
      onInputChange,
      placeholder = 'Type to search...',
      loading,
      emptyMessage = 'No results.',
      freeSolo = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);
    const v = variant ?? 'default';
    const s = size ?? 'md';

    const selected = options.find((o) => o.value === value);

    React.useEffect(() => {
      if (selected && !open) setQuery(selected.label);
    }, [selected, open]);

    const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      onInputChange?.(val);
      if (!open) setOpen(true);
      if (freeSolo) onChange?.(val);
    };

    const handleSelect = (option: AutoCompleteOption) => {
      onChange?.(option.value);
      setQuery(option.label);
      setOpen(false);
    };

    const handleBlur = () => {
      setTimeout(() => setOpen(false), 150);
    };

    return (
      <div ref={ref} className={cn(autoCompleteVariants({ variant, size }), className)} {...props}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          className={cn(
            'flex w-full rounded-md border transition-all outline-none',
            triggerClasses[v],
            sizeClasses[s],
            disabled && 'pointer-events-none opacity-50',
          )}
        />

        {open && (
          <div
            className={cn(
              'absolute z-50 mt-1 w-full rounded-md border shadow-lg',
              v === 'cyber'
                ? 'border-cyan-500/30 bg-black/95 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                : v === 'glass'
                  ? 'glass border-white/10'
                  : 'border-border bg-popover',
            )}
          >
            <div className="max-h-48 overflow-auto p-1">
              {loading ? (
                <p className="text-muted-foreground px-2 py-3 text-center text-xs">Loading...</p>
              ) : filtered.length === 0 ? (
                <p className="text-muted-foreground px-2 py-3 text-center text-xs">
                  {emptyMessage}
                </p>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={value === option.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
                      value === option.value
                        ? v === 'cyber'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-accent text-accent-foreground'
                        : v === 'cyber'
                          ? 'text-cyan-50 hover:bg-cyan-500/10'
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
AutoComplete.displayName = 'AutoComplete';

export { AutoComplete, autoCompleteVariants };
