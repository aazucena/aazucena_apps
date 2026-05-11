'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const searchInputVariants = cva('flex items-center gap-2 rounded-md border transition-colors', {
  variants: {
    variant: {
      default:
        'border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      glass: 'glass-m border-white/10 focus-within:border-white/30',
      cyber:
        'border-cyan-500/30 bg-black/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    },
    size: {
      sm: 'h-8 px-2 text-xs',
      md: 'h-9 px-3 text-sm',
      lg: 'h-10 px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface SearchInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof searchInputVariants> {
  loading?: boolean;
  onClear?: () => void;
}

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, variant, size, loading, onClear, value, ...props }, ref) => (
    <div className={cn(searchInputVariants({ variant, size }), className)}>
      <span className="text-muted-foreground shrink-0">
        {loading ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <SearchIcon />
        )}
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-0.5 transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  ),
);
SearchInput.displayName = 'SearchInput';

export { SearchInput, searchInputVariants };
