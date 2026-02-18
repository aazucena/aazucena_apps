'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const cascaderVariants = cva('relative w-full', {
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

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export interface CascaderProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof cascaderVariants> {
  options: CascaderOption[];
  value?: string[];
  onChange?: (value: string[], labels: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  expandTrigger?: 'click' | 'hover';
}

const Cascader = React.forwardRef<HTMLDivElement, CascaderProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      options,
      value = [],
      onChange,
      placeholder = 'Select...',
      disabled,
      expandTrigger = 'click',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [activePath, setActivePath] = React.useState<string[]>(value);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const v = variant ?? 'default';
    const s = size ?? 'md';

    React.useEffect(() => {
      setActivePath(value);
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      if (open) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const getColumns = (): CascaderOption[][] => {
      const columns: CascaderOption[][] = [options];
      let current = options;
      for (const val of activePath) {
        const found = current.find((o) => o.value === val);
        if (found?.children?.length) {
          columns.push(found.children);
          current = found.children;
        } else break;
      }
      return columns;
    };

    const getLabels = (path: string[]): string[] => {
      const labels: string[] = [];
      let current = options;
      for (const val of path) {
        const found = current.find((o) => o.value === val);
        if (found) {
          labels.push(found.label);
          current = found.children ?? [];
        } else break;
      }
      return labels;
    };

    const handleSelect = (option: CascaderOption, depth: number) => {
      const newPath = [...activePath.slice(0, depth), option.value];
      setActivePath(newPath);

      if (!option.children?.length) {
        onChange?.(newPath, getLabels(newPath));
        setOpen(false);
      }
    };

    const handleHover = (option: CascaderOption, depth: number) => {
      if (expandTrigger === 'hover') {
        const newPath = [...activePath.slice(0, depth), option.value];
        setActivePath(newPath);
      }
    };

    const displayLabel = value.length > 0 ? getLabels(value).join(' / ') : '';
    const columns = getColumns();

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(cascaderVariants({ variant, size }), className)}
        {...props}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center justify-between rounded-md border transition-all outline-none',
            triggerClasses[v],
            sizeClasses[s],
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          <span className={cn(!displayLabel && 'text-muted-foreground', 'truncate')}>
            {displayLabel || placeholder}
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
            className={cn(
              'absolute z-50 mt-1 flex rounded-md border shadow-lg',
              v === 'cyber'
                ? 'border-cyan-500/30 bg-black/95 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                : v === 'glass'
                  ? 'glass border-white/10'
                  : 'border-border bg-popover',
            )}
          >
            {columns.map((column, depth) => (
              <div
                key={depth}
                className={cn(
                  'max-h-56 w-40 overflow-auto p-1',
                  depth > 0 && 'border-l',
                  v === 'cyber' ? 'border-cyan-500/20' : 'border-border',
                )}
              >
                {column.map((option) => {
                  const isActive = activePath[depth] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelect(option, depth)}
                      onMouseEnter={() => handleHover(option, depth)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors',
                        option.disabled && 'pointer-events-none opacity-50',
                        isActive
                          ? v === 'cyber'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-accent text-accent-foreground'
                          : v === 'cyber'
                            ? 'text-cyan-50 hover:bg-cyan-500/10'
                            : 'hover:bg-accent',
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.children && option.children.length > 0 && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="shrink-0"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
Cascader.displayName = 'Cascader';

export { Cascader, cascaderVariants };
