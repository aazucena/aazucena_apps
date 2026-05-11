'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const tagsInputVariants = cva(
  'flex w-full flex-wrap items-center gap-1.5 rounded-md border px-3 py-2 transition-all',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        glass: 'glass-m border-white/10',
        cyber:
          'border-cyan-500/30 bg-black/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
      },
      size: {
        sm: 'min-h-8 text-xs',
        md: 'min-h-9 text-sm',
        lg: 'min-h-10 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

const tagStyles: Record<string, string> = {
  default: 'bg-muted text-foreground',
  glass: 'bg-white/10 text-foreground',
  cyber: 'bg-cyan-500/10 text-cyan-300 font-mono text-xs',
};

export interface TagsInputProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof tagsInputVariants> {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
}

const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      className,
      variant = 'default',
      size,
      value = [],
      onChange,
      placeholder = 'Add tag...',
      max,
      allowDuplicates = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const [input, setInput] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (!allowDuplicates && value.includes(trimmed)) return;
      if (max && value.length >= max) return;
      onChange?.([...value, trimmed]);
      setInput('');
    };

    const removeTag = (idx: number) => {
      onChange?.(value.filter((_, i) => i !== idx));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(input);
      }
      if (e.key === 'Backspace' && !input && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          tagsInputVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5', tagStyles[v])}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="ml-0.5 opacity-60 hover:opacity-100"
              aria-label={`Remove ${tag}`}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className={cn(
            'placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent outline-none',
            v === 'cyber' && 'font-mono text-cyan-50 placeholder:text-cyan-500/30',
          )}
        />
      </div>
    );
  },
);
TagsInput.displayName = 'TagsInput';

export { TagsInput, tagsInputVariants };
